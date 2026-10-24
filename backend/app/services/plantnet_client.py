import httpx
from fastapi import HTTPException, status

from app.config import get_settings
from app.schemas import IdentificationCandidate, IdentifyResponse, PlantSummary
from app.services.plants import find_by_botanical_name

PLANTNET_BASE_URL = "https://my-api.plantnet.org/v2/identify"
MAX_CANDIDATES = 5
NOT_IDENTIFIED = "Pl@ntNet could not identify this photo. Try a sharper photo of a single leaf or flower."


def to_candidates(payload: dict) -> list[IdentificationCandidate]:
    """Map Pl@ntNet's response to candidates, linking species we have data for."""
    candidates = []
    for result in payload.get("results", [])[:MAX_CANDIDATES]:
        species = result.get("species") or {}
        family = species.get("family") or {}
        scientific_name = species.get("scientificNameWithoutAuthor") or "Unknown species"
        local_plant = find_by_botanical_name(scientific_name)
        candidates.append(
            IdentificationCandidate(
                scientific_name=scientific_name,
                common_names=species.get("commonNames") or [],
                family=family.get("scientificNameWithoutAuthor") or family.get("scientificName"),
                confidence=min(max(float(result.get("score") or 0), 0.0), 1.0),
                plant=PlantSummary.from_plant(local_plant) if local_plant else None,
            )
        )
    return candidates


async def identify_image(image_bytes: bytes, filename: str, content_type: str, organ: str) -> IdentifyResponse:
    settings = get_settings()
    if not settings.plantnet_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Plant identification is not set up yet. Add a Pl@ntNet API key to the server settings.",
        )

    url = f"{PLANTNET_BASE_URL}/{settings.plantnet_project}"
    params = {"api-key": settings.plantnet_api_key, "lang": "en", "nb-results": MAX_CANDIDATES}
    files = {"images": (filename, image_bytes, content_type)}
    data = {"organs": organ}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, params=params, files=files, data=data)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach Pl@ntNet. Please try again in a moment.",
        ) from exc

    if response.status_code == 404:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=NOT_IDENTIFIED)
    if response.status_code in (401, 403):
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Pl@ntNet rejected the configured API key.")
    if response.status_code == 429:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The daily identification limit has been reached. Please try again tomorrow.",
        )
    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Pl@ntNet returned an error ({response.status_code}). Please try again.",
        )

    payload = response.json()
    candidates = to_candidates(payload)
    if not candidates:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=NOT_IDENTIFIED)

    return IdentifyResponse(candidates=candidates, remaining_requests=payload.get("remainingIdentificationRequests"))
