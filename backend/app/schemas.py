from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from app.services.plants import Plant

Setting = Literal["indoor", "outdoor"]
Light = Literal["full sun", "partial shade", "full shade", "bright indirect", "medium indirect", "low light"]
Water = Literal["low", "moderate", "high"]
CareLevel = Literal["easy", "moderate", "challenging"]
Space = Literal["small", "medium", "large"]
Organ = Literal["leaf", "flower", "fruit", "bark", "auto"]

# bcrypt only reads the first 72 bytes of a password and bcrypt>=5 rejects
# anything longer, so cap it where the visitor can be told why.
PASSWORD_MAX_BYTES = 72


class SignUpRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)

    @field_validator("name")
    @classmethod
    def strip_name(cls, name: str) -> str:
        name = name.strip()
        if not name:
            raise ValueError("Enter your name.")
        return name

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, email: str) -> str:
        return email.lower()

    @field_validator("password")
    @classmethod
    def fits_bcrypt(cls, password: str) -> str:
        if len(password.encode("utf-8")) > PASSWORD_MAX_BYTES:
            raise ValueError("Password is too long.")
        return password


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(max_length=256)

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, email: str) -> str:
        return email.lower()


class UserResponse(BaseModel):
    id: str
    name: str
    email: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class PlantSummary(BaseModel):
    id: str
    common_name: str
    botanical_name: str
    category: str
    settings: list[str]
    light: list[str]
    water: str
    care_level: str
    lifecycle: str
    zone_min: int | None
    zone_max: int | None
    height_ft_min: float
    height_ft_max: float

    @classmethod
    def from_plant(cls, plant: Plant) -> "PlantSummary":
        return cls(
            id=plant.id,
            common_name=plant.common_name,
            botanical_name=plant.botanical_name,
            category=plant.category,
            settings=list(plant.settings),
            light=list(plant.light),
            water=plant.water,
            care_level=plant.care_level,
            lifecycle=plant.lifecycle,
            zone_min=plant.zone_min,
            zone_max=plant.zone_max,
            height_ft_min=plant.height_ft_min,
            height_ft_max=plant.height_ft_max,
        )


class RecommendRequest(BaseModel):
    setting: Setting
    light: Light
    water: Water
    care_level: CareLevel
    space: Space
    zone: int | None = Field(default=None, ge=1, le=12)
    category: str | None = None

    @model_validator(mode="after")
    def zone_needed_outdoors(self) -> "RecommendRequest":
        if self.setting == "outdoor" and self.zone is None:
            raise ValueError("Choose your hardiness zone for outdoor plants.")
        return self


class RecommendedPlant(BaseModel):
    plant: PlantSummary
    confidence: float = Field(ge=0, le=1)


class RecommendResponse(BaseModel):
    results: list[RecommendedPlant]


class IdentificationCandidate(BaseModel):
    scientific_name: str
    common_names: list[str]
    family: str
    confidence: float = Field(ge=0, le=1)
    plant: PlantSummary | None


class IdentifyResponse(BaseModel):
    candidates: list[IdentificationCandidate]
    remaining_requests: int
