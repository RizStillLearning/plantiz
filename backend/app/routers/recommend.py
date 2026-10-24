from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User
from app.schemas import PlantSummary, RecommendedPlant, RecommendRequest, RecommendResponse
from app.security import get_current_user
from app.services.recommender import Environment, recommend

router = APIRouter(prefix="/api", tags=["recommend"])


@router.post("/recommend", response_model=RecommendResponse)
def recommend_plants(request: RecommendRequest, _: User = Depends(get_current_user)) -> RecommendResponse:
    environment = Environment(**request.model_dump())
    try:
        recommendations = recommend(environment)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(error)) from error

    return RecommendResponse(
        results=[
            RecommendedPlant(plant=PlantSummary.from_plant(item.plant), confidence=item.confidence)
            for item in recommendations
        ]
    )
