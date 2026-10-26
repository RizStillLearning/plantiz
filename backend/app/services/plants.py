"""The plant dataset (data/plants.csv), loaded once per process."""

from dataclasses import dataclass
from functools import lru_cache

import pandas as pd

from app.config import get_settings


@dataclass(frozen=True)
class Plant:
    id: str
    common_name: str
    botanical_name: str
    category: str
    settings: tuple[str, ...]
    light: tuple[str, ...]
    water: str
    care_level: str
    lifecycle: str
    zone_min: int | None
    zone_max: int | None
    height_ft_min: float
    height_ft_max: float
    popularity: int

    def grows_in_zone(self, zone: int) -> bool:
        # Plants without a zone range are annuals: grown for one season, so
        # winter hardiness doesn't limit where they can be planted.
        if self.zone_min is None:
            return True
        return self.zone_min <= zone <= self.zone_max


def _optional_int(value) -> int | None:
    return None if pd.isna(value) else int(value)


def _split(value: str) -> tuple[str, ...]:
    return tuple(value.split(";"))


@lru_cache
def load_dataframe() -> pd.DataFrame:
    return pd.read_csv(
        get_settings().plants_csv_path,
        dtype={"zone_min": "Int64", "zone_max": "Int64"},
        keep_default_na=False,
        na_values={"zone_min": [""], "zone_max": [""]},
    )


@lru_cache
def load_plants() -> tuple[Plant, ...]:
    return tuple(
        Plant(
            id=row.id,
            common_name=row.common_name,
            botanical_name=row.botanical_name,
            category=row.category,
            settings=_split(row.setting),
            light=_split(row.light),
            water=row.water,
            care_level=row.care_level,
            lifecycle=row.lifecycle,
            zone_min=_optional_int(row.zone_min),
            zone_max=_optional_int(row.zone_max),
            height_ft_min=float(row.height_ft_min),
            height_ft_max=float(row.height_ft_max),
            popularity=int(row.popularity),
        )
        for row in load_dataframe().itertuples(index=False)
    )


@lru_cache
def categories() -> tuple[str, ...]:
    return tuple(sorted({plant.category for plant in load_plants()}))


def _genus_and_species(botanical_name: str) -> tuple[str, ...]:
    # Hybrid markers ("Alocasia × amazonica") are not part of the binomial.
    words = [word for word in botanical_name.lower().split() if word not in {"×", "x"}]
    return tuple(words[:2])


def find_by_botanical_name(botanical_name: str) -> Plant | None:
    needle = _genus_and_species(botanical_name)
    return next(
        (plant for plant in load_plants() if _genus_and_species(plant.botanical_name) == needle),
        None,
    )
