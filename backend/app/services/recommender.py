"""Plant recommendations, as described in contents/recommendation.md.

Plants that can't live in the visitor's setting or zone, or aren't the plant
group they asked for, are filtered out. The rest are ranked with k-nearest
neighbours under cosine distance, and 1 - distance (the cosine similarity) is
the confidence score.

Each feature gets its own block of columns, scaled to unit length and then by
the square root of its weight. That makes the cosine similarity a weighted
average of how well each feature matches, so 0.9 reads as "agrees on 90% of
what matters".
"""

import math
from dataclasses import dataclass
from functools import lru_cache

import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder, OrdinalEncoder, normalize

from app.services.plants import Plant, categories, load_plants

LIGHT_LEVELS = ("full sun", "partial shade", "full shade", "bright indirect", "medium indirect", "low light")
WATER_LEVELS = ("low", "moderate", "high")
CARE_LEVELS = ("easy", "moderate", "challenging")
SPACE_LEVELS = ("small", "medium", "large")

ORDINAL_FEATURES = ("water", "care_level", "space")
ORDINAL_LEVELS = (WATER_LEVELS, CARE_LEVELS, SPACE_LEVELS)

# How much each feature counts towards the confidence score.
WEIGHTS = {"light": 3.0, "water": 2.0, "care_level": 2.0, "space": 1.5, "category": 2.0}

MAX_RESULTS = 5

# Equal similarities can differ in the last floating-point bits.
TIE_TOLERANCE = 1e-9


def space_for_height(height_ft: float) -> str:
    if height_ft <= 2:
        return "small"
    if height_ft <= 6:
        return "medium"
    return "large"


def _angular(codes: np.ndarray, level_count: int) -> np.ndarray:
    """Place label-encoded ordinal values on a quarter circle.

    Cosine similarity ignores a feature whose value is 0, so raw label codes
    would make the lowest level ("low" water, "easy" care) invisible. As an
    angle, code k becomes the unit vector at k / (n - 1) * 90 degrees: two
    values then agree by cos(distance), 1.0 when equal, 0.71 one step apart on a
    three-level scale and 0 at opposite ends.
    """
    angles = codes / (level_count - 1) * (math.pi / 2)
    return np.column_stack([np.cos(angles), np.sin(angles)])


@dataclass(frozen=True)
class Environment:
    setting: str
    light: str
    water: str
    care_level: str
    space: str
    zone: int | None = None
    category: str | None = None


@dataclass(frozen=True)
class Recommendation:
    plant: Plant
    confidence: float


class _Model:
    def __init__(self, plants: tuple[Plant, ...]) -> None:
        self.plants = plants

        self.ordinal = OrdinalEncoder(categories=[list(levels) for levels in ORDINAL_LEVELS])
        self.category = OneHotEncoder(categories=[list(categories())], sparse_output=False)
        self.light = MultiLabelBinarizer(classes=list(LIGHT_LEVELS))

        ordinal_codes = self.ordinal.fit_transform(
            [[plant.water, plant.care_level, space_for_height(plant.height_ft_max)] for plant in plants]
        )
        self.blocks = {
            **self._ordinal_blocks(ordinal_codes),
            # A plant can tolerate several light levels, so this one is multi-hot.
            "light": normalize(self.light.fit_transform([plant.light for plant in plants])),
            "category": self.category.fit_transform([[plant.category] for plant in plants]),
        }

    @staticmethod
    def _ordinal_blocks(codes: np.ndarray) -> dict[str, np.ndarray]:
        return {
            feature: _angular(codes[:, index], len(levels))
            for index, (feature, levels) in enumerate(zip(ORDINAL_FEATURES, ORDINAL_LEVELS))
        }

    def encode(self, environment: Environment) -> dict[str, np.ndarray]:
        codes = self.ordinal.transform([[environment.water, environment.care_level, environment.space]])
        blocks = {
            **self._ordinal_blocks(codes),
            "light": normalize(self.light.transform([[environment.light]])),
        }
        if environment.category:
            blocks["category"] = self.category.transform([[environment.category]])
        return blocks


@lru_cache
def _model() -> _Model:
    return _Model(load_plants())


def _is_candidate(plant: Plant, environment: Environment) -> bool:
    if environment.setting not in plant.settings:
        return False
    if environment.category and plant.category != environment.category:
        return False
    if environment.setting == "outdoor":
        return plant.grows_in_zone(environment.zone)
    return True


def recommend(environment: Environment, limit: int = MAX_RESULTS) -> list[Recommendation]:
    if environment.category and environment.category not in categories():
        raise ValueError(f"Unknown plant group: {environment.category}")

    model = _model()
    candidates = [index for index, plant in enumerate(model.plants) if _is_candidate(plant, environment)]
    if not candidates:
        return []

    user_blocks = model.encode(environment)
    # The plant group only counts when one was chosen.
    features = list(user_blocks)
    scale = {feature: math.sqrt(WEIGHTS[feature]) for feature in features}

    plant_matrix = np.hstack([model.blocks[feature][candidates] * scale[feature] for feature in features])
    user_vector = np.hstack([user_blocks[feature] * scale[feature] for feature in features])

    knn = NearestNeighbors(metric="cosine", algorithm="brute").fit(plant_matrix)
    distances, _ = knn.kneighbors(user_vector, n_neighbors=min(limit, len(candidates)))

    # Many plants have identical needs and kneighbors picks among ties
    # arbitrarily. Take everything as near as the k-th neighbour and let the
    # better-known plant win (popularity 1 is the most familiar).
    tie_distances, tie_rows = knn.radius_neighbors(user_vector, radius=distances[0, -1] + TIE_TOLERANCE)
    nearest = [(model.plants[candidates[row]], distance) for row, distance in zip(tie_rows[0], tie_distances[0])]
    nearest.sort(key=lambda pair: (round(pair[1], 9), pair[0].popularity, pair[0].common_name))
    return [
        Recommendation(plant=plant, confidence=round(float(np.clip(1 - distance, 0, 1)), 4))
        for plant, distance in nearest[:limit]
    ]
