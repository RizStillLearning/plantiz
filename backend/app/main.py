from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db import init_db
from app.routers import auth, identify, recommend

settings = get_settings()

init_db()

# Everything lives under /api: NGINX (Docker) and Vercel both route that
# prefix to this app and serve the prerendered frontend for every other path.
app = FastAPI(
    title="Plantiz API",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recommend.router)
app.include_router(identify.router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
