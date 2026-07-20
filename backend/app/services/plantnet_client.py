import httpx
from fastapi import HTTPException

from app.config import get_settings
from app.schemas import IdentificationCandidate, IdentifyResponse, PlantResult
from app.services.recommender import find_plant_by_scientific_name

PLANTNET_BASE_URL = "https://my-api.plantnet.org/v2/identify"


async def identify_image(image_bytes: bytes, filename: str, content_type: str, organ: str) -> IdentifyResponse:
    settings = get_settings()
    if not settings.plantnet_api_key:
        raise HTTPException(
            status_code=503,
            detail=(
                "Plant identification is not configured yet. Get a free API key at "
                "https://my.plantnet.org and add it to backend/.env as PLANTNET_API_KEY."
            ),
        )

    url = f"{PLANTNET_BASE_URL}/{settings.plantnet_project}"
    params = {"api-key": settings.plantnet_api_key}
    files = {"images": (filename, image_bytes, content_type)}
    data = {"organs": organ}

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(url, params=params, files=files, data=data)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Could not reach Pl@ntNet: {exc}") from exc

    if response.status_code == 401:
        raise HTTPException(status_code=502, detail="Pl@ntNet rejected the configured API key.")
    if response.status_code == 404:
        raise HTTPException(status_code=422, detail="Pl@ntNet could not identify this image. Try a clearer photo of a leaf or flower.")
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Pl@ntNet error ({response.status_code}): {response.text}")

    payload = response.json()
    candidates = []
    for result in payload.get("results", [])[:5]:
        species = result.get("species", {})
        scientific_name = species.get("scientificNameWithoutAuthor", "Unknown")
        local_plant = find_plant_by_scientific_name(scientific_name)
        candidates.append(
            IdentificationCandidate(
                scientific_name=scientific_name,
                common_names=species.get("commonNames", []),
                family=(species.get("family") or {}).get("scientificName"),
                confidence=round(result.get("score", 0.0) * 100, 1),
                local_match=PlantResult(
                    id=local_plant["id"],
                    common_name=local_plant["common_name"],
                    scientific_name=local_plant["scientific_name"],
                    match_score=100,
                    light=local_plant["light"],
                    water_frequency=local_plant["water_frequency"],
                    humidity=local_plant["humidity"],
                    difficulty=local_plant["difficulty"],
                    pet_friendly=local_plant["pet_friendly"],
                    description=local_plant["description"],
                    care_tips=local_plant["care_tips"],
                )
                if local_plant
                else None,
            )
        )

    if not candidates:
        raise HTTPException(status_code=422, detail="Pl@ntNet could not identify this image. Try a clearer photo of a leaf or flower.")

    return IdentifyResponse(candidates=candidates, remaining_requests=payload.get("remainingIdentificationRequests"))
