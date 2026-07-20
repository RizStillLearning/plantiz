from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import identify, recommend

settings = get_settings()

app = FastAPI(title="Plantiz API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router)
app.include_router(identify.router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
