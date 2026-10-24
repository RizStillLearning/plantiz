from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.config import get_settings
from app.models import User
from app.schemas import IdentifyResponse, Organ
from app.security import get_current_user
from app.services.plantnet_client import identify_image

router = APIRouter(prefix="/api", tags=["identify"])

# Magic numbers, so the check does not rely on the client-supplied content type.
IMAGE_SIGNATURES = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
}


def _detect_image_type(data: bytes) -> str | None:
    return next((kind for signature, kind in IMAGE_SIGNATURES.items() if data.startswith(signature)), None)


@router.post("/identify", response_model=IdentifyResponse)
async def identify(
    image: UploadFile = File(...),
    organ: Organ = Form("auto"),
    _: User = Depends(get_current_user),
) -> IdentifyResponse:
    max_bytes = get_settings().max_upload_mb * 1024 * 1024
    image_bytes = await image.read(max_bytes + 1)
    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="The uploaded file is empty.")
    if len(image_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"Please upload a photo smaller than {get_settings().max_upload_mb} MB.",
        )

    content_type = _detect_image_type(image_bytes)
    if content_type is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="Please upload a JPEG or PNG photo."
        )

    return await identify_image(image_bytes, image.filename or "upload", content_type, organ)
