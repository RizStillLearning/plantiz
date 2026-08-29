from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field

Light = Literal["low", "medium", "bright", "direct"]
Humidity = Literal["low", "medium", "high"]
Space = Literal["small", "medium", "large"]
Experience = Literal["beginner", "intermediate", "expert"]
Weather = Literal["sunny", "cloudy", "rainy", "windy"]
Dryness = Literal["low", "medium", "high"]
Organ = Literal["leaf", "flower", "fruit", "bark", "auto"]


class EnvironmentRequest(BaseModel):
    light: Light
    humidity: Humidity
    temperature_c: float = Field(ge=-10, le=50)
    space: Space
    experience: Experience
    pets: bool = False
    weather: Weather = "sunny"
    dryness: Dryness = "medium"


class PlantResult(BaseModel):
    id: str
    common_name: str
    scientific_name: str
    match_score: int
    light: list[str]
    water_frequency: str
    humidity: str
    difficulty: str
    pet_friendly: bool
    description: str
    care_tips: list[str]


class RecommendResponse(BaseModel):
    results: list[PlantResult]


class ChatRequest(BaseModel):
    question: str
    context: Optional[list[str]] = None


class ChatResponse(BaseModel):
    reply: str


class IdentificationCandidate(BaseModel):
    scientific_name: str
    common_names: list[str]
    family: Optional[str] = None
    confidence: float
    local_match: Optional[PlantResult] = None


class IdentifyResponse(BaseModel):
    candidates: list[IdentificationCandidate]
    remaining_requests: Optional[int] = None


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
