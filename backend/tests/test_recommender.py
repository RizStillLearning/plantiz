import math

import numpy as np
import pytest
from sklearn.metrics.pairwise import cosine_similarity

from app.services import recommender
from app.services.plants import load_plants
from app.services.recommender import Environment, recommend, space_for_height


def plant(plant_id: str):
    return next(p for p in load_plants() if p.id == plant_id)


def test_exact_profile_match_scores_full_confidence():
    # Air plant: indoor, bright indirect only, moderate water, easy, 0.3 ft tall.
    air_plant = plant("air-plant")
    environment = Environment(
        setting="indoor",
        light="bright indirect",
        water=air_plant.water,
        care_level=air_plant.care_level,
        space=space_for_height(air_plant.height_ft_max),
        category=air_plant.category,
    )

    results = recommend(environment)

    assert results[0].confidence == pytest.approx(1.0)
    assert "air-plant" in {result.plant.id for result in results if result.confidence == pytest.approx(1.0)}


def test_returns_at_most_five_sorted_by_confidence():
    results = recommend(Environment("indoor", "low light", "low", "easy", "small"))

    assert 0 < len(results) <= 5
    confidences = [result.confidence for result in results]
    assert confidences == sorted(confidences, reverse=True)
    assert all(0 <= confidence <= 1 for confidence in confidences)


def test_only_recommends_plants_for_the_chosen_setting():
    for setting, zone in (("indoor", None), ("outdoor", 6)):
        results = recommend(Environment(setting, "full sun", "moderate", "easy", "medium", zone=zone))
        assert all(setting in result.plant.settings for result in results)


def test_outdoor_plants_must_survive_the_zone():
    results = recommend(Environment("outdoor", "full sun", "moderate", "easy", "large", zone=3))

    for result in results:
        if result.plant.zone_min is not None:
            assert result.plant.zone_min <= 3 <= result.plant.zone_max


def test_light_the_plant_cannot_take_lowers_confidence():
    results = recommend(Environment("indoor", "low light", "moderate", "easy", "small", category="Houseplant"))

    assert "low light" in results[0].plant.light


def test_plant_group_preference_is_respected():
    results = recommend(Environment("outdoor", "full sun", "moderate", "easy", "small", zone=7, category="Herb & Spice"))

    assert results
    assert all(result.plant.category == "Herb & Spice" for result in results)


def test_chosen_group_is_not_outranked_by_other_groups():
    # Regression: apples, grapes and wisteria fit every other answer here, and
    # used to fill the top five at 81% while houseplants hardy to zone 8 existed.
    results = recommend(Environment("outdoor", "full sun", "moderate", "moderate", "large", zone=8, category="Houseplant"))

    assert results
    assert all(result.plant.category == "Houseplant" for result in results)
    assert results[0].plant.id == "sago-palm"
    assert len({result.confidence for result in results}) == len(results)


def test_group_that_cannot_grow_there_returns_nothing():
    assert recommend(Environment("outdoor", "full sun", "moderate", "easy", "small", zone=3, category="Houseplant")) == []


def test_lowest_ordinal_level_still_counts():
    # "low" water is label code 0; it must still steer results, not vanish.
    low = recommend(Environment("indoor", "bright indirect", "low", "easy", "small"))
    high = recommend(Environment("indoor", "bright indirect", "high", "easy", "small"))

    assert low[0].plant.water == "low"
    assert high[0].plant.water == "high"


def test_unknown_plant_group_is_rejected():
    with pytest.raises(ValueError):
        recommend(Environment("indoor", "low light", "low", "easy", "small", category="Moon Rocks"))


@pytest.mark.parametrize(
    "environment",
    [
        Environment("indoor", "low light", "low", "easy", "small"),
        # Many plants tie for first place here: ties must break the same way.
        Environment("indoor", "bright indirect", "moderate", "easy", "small", category="Houseplant"),
        Environment("outdoor", "full sun", "low", "challenging", "medium", zone=7, category="Fern"),
        Environment("outdoor", "partial shade", "high", "moderate", "large", zone=5),
    ],
)
def test_knn_returns_the_plants_with_highest_cosine_similarity(environment):
    # Reference: score every candidate with cosine_similarity and sort, with the
    # same tie rule (popularity, then name). KNN must return exactly its top 5.
    model = recommender._model()
    candidates = [i for i, plant in enumerate(model.plants) if recommender._is_candidate(plant, environment)]
    user_blocks = model.encode(environment)
    weights = {feature: math.sqrt(recommender.WEIGHTS[feature]) for feature in user_blocks}
    plant_matrix = np.hstack([model.blocks[f][candidates] * w for f, w in weights.items()])
    user_vector = np.hstack([user_blocks[f] * w for f, w in weights.items()])
    similarities = cosine_similarity(user_vector, plant_matrix)[0]
    expected = sorted(
        zip(candidates, similarities),
        key=lambda pair: (round(1 - pair[1], 9), model.plants[pair[0]].popularity, model.plants[pair[0]].common_name),
    )[:5]

    results = recommend(environment)

    assert [result.plant.id for result in results] == [model.plants[i].id for i, _ in expected]
    assert [result.confidence for result in results] == pytest.approx([float(s) for _, s in expected], abs=1e-4)
