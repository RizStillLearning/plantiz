import pytest

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
