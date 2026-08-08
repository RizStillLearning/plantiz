import json
import math
from functools import lru_cache
from pathlib import Path

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.schemas import EnvironmentRequest, PlantResult

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "plants.json"

_LIGHT_LEVELS = ["low", "medium", "bright", "direct"]
_HUMIDITY_LEVELS = ["low", "medium", "high"]
_SPACE_LEVELS = ["small", "medium", "large"]
_WATER_LEVELS = ["low", "medium", "high"]
_DIFFICULTY_LEVELS = ["beginner", "intermediate", "expert"]

_TEMPERATURE_MIN_C = -10.0
_TEMPERATURE_MAX_C = 50.0

_LIGHT_WEIGHT = 2.5
_HUMIDITY_WEIGHT = 2.0
_TEMPERATURE_WEIGHT = 2.0
_SPACE_WEIGHT = 1.5
_WATER_WEIGHT = 1.5
_DIFFICULTY_WEIGHT = 1.2
_PET_WEIGHT = 1.0


@lru_cache
def _load_plants() -> list[dict]:
    with DATA_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def _one_hot(levels: list[str], value: str, weight: float) -> list[float]:
    scale = math.sqrt(weight)
    return [scale if level == value else 0.0 for level in levels]


def _multi_hot(levels: list[str], values: list[str], weight: float) -> list[float]:
    scale = math.sqrt(weight)
    return [scale if level in values else 0.0 for level in levels]


def _cumulative_hot(levels: list[str], up_to: str, weight: float) -> list[float]:
    scale = math.sqrt(weight)
    cutoff = levels.index(up_to)
    return [scale if index <= cutoff else 0.0 for index in range(len(levels))]


def _normalized(value: float, low: float, high: float) -> float:
    clamped = min(max(value, low), high)
    return (clamped - low) / (high - low)


def _temperature_features(min_c: float, max_c: float, weight: float) -> list[float]:
    scale = math.sqrt(weight / 2)
    return [
        scale * _normalized(min_c, _TEMPERATURE_MIN_C, _TEMPERATURE_MAX_C),
        scale * _normalized(max_c, _TEMPERATURE_MIN_C, _TEMPERATURE_MAX_C),
    ]


def _target_water_level(weather: str, dryness: str) -> str:
    """Blend forecast weather with soil dryness into a target watering demand."""
    if dryness == "high" or weather == "sunny":
        return "low"
    if dryness == "low" or weather == "rainy":
        return "high"
    return "medium"


def _plant_vector(plant: dict, include_pet: bool) -> list[float]:
    vector = [
        *_multi_hot(_LIGHT_LEVELS, plant["light"], _LIGHT_WEIGHT),
        *_one_hot(_HUMIDITY_LEVELS, plant["humidity"], _HUMIDITY_WEIGHT),
        *_temperature_features(plant["temperature_min_c"], plant["temperature_max_c"], _TEMPERATURE_WEIGHT),
        *_multi_hot(_SPACE_LEVELS, plant["space"], _SPACE_WEIGHT),
        *_one_hot(_WATER_LEVELS, plant["water_frequency"], _WATER_WEIGHT),
        *_one_hot(_DIFFICULTY_LEVELS, plant["difficulty"], _DIFFICULTY_WEIGHT),
    ]
    if include_pet:
        vector.append(math.sqrt(_PET_WEIGHT) if plant["pet_friendly"] else 0.0)
    return vector


def _environment_vector(env: EnvironmentRequest) -> list[float]:
    temperature_scale = math.sqrt(_TEMPERATURE_WEIGHT / 2)
    temperature_norm = _normalized(env.temperature_c, _TEMPERATURE_MIN_C, _TEMPERATURE_MAX_C)
    vector = [
        *_one_hot(_LIGHT_LEVELS, env.light, _LIGHT_WEIGHT),
        *_one_hot(_HUMIDITY_LEVELS, env.humidity, _HUMIDITY_WEIGHT),
        temperature_scale * temperature_norm,
        temperature_scale * temperature_norm,
        *_one_hot(_SPACE_LEVELS, env.space, _SPACE_WEIGHT),
        *_one_hot(_WATER_LEVELS, _target_water_level(env.weather, env.dryness), _WATER_WEIGHT),
        *_cumulative_hot(_DIFFICULTY_LEVELS, env.experience, _DIFFICULTY_WEIGHT),
    ]
    if env.pets:
        vector.append(math.sqrt(_PET_WEIGHT))
    return vector


def score_plants(plants: list[dict], env: EnvironmentRequest) -> list[int]:
    plant_matrix = np.array([_plant_vector(plant, include_pet=env.pets) for plant in plants])
    env_vector = np.array([_environment_vector(env)])
    similarities = cosine_similarity(plant_matrix, env_vector).flatten()
    return [round(max(0.0, min(1.0, similarity)) * 100) for similarity in similarities]


def _to_result(plant: dict, score: int) -> PlantResult:
    return PlantResult(
        id=plant["id"],
        common_name=plant["common_name"],
        scientific_name=plant["scientific_name"],
        match_score=score,
        light=plant["light"],
        water_frequency=plant["water_frequency"],
        humidity=plant["humidity"],
        difficulty=plant["difficulty"],
        pet_friendly=plant["pet_friendly"],
        description=plant["description"],
        care_tips=plant["care_tips"],
    )


def recommend_plants(env: EnvironmentRequest, top_n: int = 5) -> list[PlantResult]:
    plants = _load_plants()
    # Pet safety is a hard constraint, not a similarity signal: never recommend a
    # toxic plant to a pet owner just because it scores well on other features.
    candidates = [plant for plant in plants if plant["pet_friendly"]] if env.pets else plants
    if not candidates:
        return []
    scored = list(zip(candidates, score_plants(candidates, env)))
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return [_to_result(plant, score) for plant, score in scored[:top_n]]


def find_plant_by_scientific_name(scientific_name: str) -> dict | None:
    needle_parts = scientific_name.strip().lower().split(" ")[:2]
    for plant in _load_plants():
        plant_parts = plant["scientific_name"].strip().lower().split(" ")[:2]
        if plant_parts == needle_parts:
            return plant
    return None
