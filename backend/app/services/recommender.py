import json
from functools import lru_cache
from pathlib import Path

from app.schemas import EnvironmentRequest, PlantResult

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "plants.json"

_DIFFICULTY_RANK = {"beginner": 1, "intermediate": 2, "expert": 3}
_LIGHT_RANK = {"low": 1, "medium": 2, "bright": 3, "direct": 4}
_HUMIDITY_RANK = {"low": 1, "medium": 2, "high": 3}

_LIGHT_WEIGHT = 25
_HUMIDITY_WEIGHT = 20
_TEMPERATURE_WEIGHT = 20
_SPACE_WEIGHT = 15
_EXPERIENCE_WEIGHT = 10
_PET_WEIGHT = 5
_WEATHER_WEIGHT = 10
_DRYNESS_WEIGHT = 10


@lru_cache
def _load_plants() -> list[dict]:
    with DATA_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def _light_score(plant: dict, light: str) -> float:
    if light in plant["light"]:
        return 1.0
    distance = min(abs(_LIGHT_RANK[light] - _LIGHT_RANK[opt]) for opt in plant["light"])
    return max(0.0, 1.0 - distance * 0.34)


def _humidity_score(plant: dict, humidity: str) -> float:
    distance = abs(_HUMIDITY_RANK[humidity] - _HUMIDITY_RANK[plant["humidity"]])
    return max(0.0, 1.0 - distance * 0.5)


def _temperature_score(plant: dict, temperature_c: float) -> float:
    low, high = plant["temperature_min_c"], plant["temperature_max_c"]
    if low <= temperature_c <= high:
        return 1.0
    overshoot = low - temperature_c if temperature_c < low else temperature_c - high
    return max(0.0, 1.0 - overshoot / 10)


def _space_score(plant: dict, space: str) -> float:
    return 1.0 if space in plant["space"] else 0.3


def _experience_score(plant: dict, experience: str) -> float:
    return 1.0 if _DIFFICULTY_RANK[plant["difficulty"]] <= _DIFFICULTY_RANK[experience] else 0.4


def _weather_score(plant: dict, weather: str) -> float:
    if weather == "sunny":
        if any(level in ["bright", "direct"] for level in plant["light"]):
            return 1.0
        if "medium" in plant["light"]:
            return 0.7
        return 0.3
    if weather == "cloudy":
        if "low" in plant["light"] or "medium" in plant["light"]:
            return 1.0
        return 0.5
    if weather == "rainy":
        if plant["humidity"] == "high" or plant["water_frequency"] == "high":
            return 1.0
        return 0.6
    if plant["humidity"] in ["medium", "high"] or plant["water_frequency"] != "low":
        return 0.9
    return 0.5


def _dryness_score(plant: dict, dryness: str) -> float:
    if dryness == "high":
        if plant["water_frequency"] == "low" and plant["humidity"] == "low":
            return 1.0
        if plant["water_frequency"] == "medium":
            return 0.75
        return 0.3
    if dryness == "low":
        if plant["water_frequency"] == "high" or plant["humidity"] == "high":
            return 1.0
        if plant["water_frequency"] == "medium":
            return 0.7
        return 0.4
    if plant["water_frequency"] != "high":
        return 0.9
    return 0.6


def _pet_score(plant: dict, pets: bool) -> float:
    if not pets:
        return 1.0
    return 1.0 if plant["pet_friendly"] else 0.0


def score_plant(plant: dict, env: EnvironmentRequest) -> int:
    total = (
        _light_score(plant, env.light) * _LIGHT_WEIGHT
        + _humidity_score(plant, env.humidity) * _HUMIDITY_WEIGHT
        + _temperature_score(plant, env.temperature_c) * _TEMPERATURE_WEIGHT
        + _space_score(plant, env.space) * _SPACE_WEIGHT
        + _experience_score(plant, env.experience) * _EXPERIENCE_WEIGHT
        + _pet_score(plant, env.pets) * _PET_WEIGHT
        + _weather_score(plant, env.weather) * _WEATHER_WEIGHT
        + _dryness_score(plant, env.dryness) * _DRYNESS_WEIGHT
    )
    return round(total)


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
    scored = [(plant, score_plant(plant, env)) for plant in plants]
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return [_to_result(plant, score) for plant, score in scored[:top_n]]


def find_plant_by_scientific_name(scientific_name: str) -> dict | None:
    needle_parts = scientific_name.strip().lower().split(" ")[:2]
    for plant in _load_plants():
        plant_parts = plant["scientific_name"].strip().lower().split(" ")[:2]
        if plant_parts == needle_parts:
            return plant
    return None
