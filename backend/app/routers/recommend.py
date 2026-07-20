from fastapi import APIRouter

from app.schemas import EnvironmentRequest, RecommendResponse
from app.services.recommender import recommend_plants

router = APIRouter(prefix="/api", tags=["recommend"])


@router.post("/recommend", response_model=RecommendResponse)
def recommend(env: EnvironmentRequest) -> RecommendResponse:
    results = recommend_plants(env)
    return RecommendResponse(results=results)
