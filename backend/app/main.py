from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.db import Base, engine
from app.routers import auth, chat, identify, recommend

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Plantiz API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router)
app.include_router(chat.router)
app.include_router(identify.router)
app.include_router(auth.router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


# Built frontend assets (see root Dockerfile), copied to ./static next to this
# package. Absent in local dev, where the Vite dev server serves the frontend.
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str) -> FileResponse:
        candidate = STATIC_DIR / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(STATIC_DIR / "index.html")
