from fastapi import APIRouter

from app.schemas import ChatRequest, ChatResponse
from app.services.recommender import _load_plants

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    plants = _load_plants()
    context_snippets = []
    if req.context:
        context_snippets = [item for item in req.context if item]

    if not context_snippets:
        context_snippets = [plant["common_name"] for plant in plants[:4]]

    prompt = (
        "You are Plantiz, a friendly plant care assistant. "
        "Answer briefly and use the provided plant context.\n"
        f"Context plants: {', '.join(context_snippets)}\n"
        f"User question: {req.question}"
    )

    reply = (
        "Based on the plants in your recommendations, I’d suggest choosing a plant that matches your light and moisture needs. "
        "For a dry, bright space, drought-tolerant choices like Aloe Vera or Snake Plant are often the safest bet."
    )

    if "water" in req.question.lower():
        reply = "Water less frequently in dry conditions and check the soil before watering again."
    elif "pet" in req.question.lower():
        reply = "If you have pets, look for pet-safe options such as Spider Plant or Boston Fern."
    elif "low light" in req.question.lower() or "dark" in req.question.lower():
        reply = "Low-light rooms often do well with Snake Plant, ZZ Plant, or Chinese Evergreen."

    return ChatResponse(reply=reply)
