from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas import IdentifyResponse, Organ
from app.services.plantnet_client import identify_image

router = APIRouter(prefix="/api", tags=["identify"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}


@router.post("/identify", response_model=IdentifyResponse)
async def identify(image: UploadFile = File(...), organ: Organ = Form("auto")) -> IdentifyResponse:
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=422, detail="Please upload a JPEG or PNG image.")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=422, detail="Uploaded file is empty.")

    return await identify_image(image_bytes, image.filename or "upload.jpg", image.content_type, organ)
