from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    plantnet_api_key: str = ""
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    plantnet_project: str = "all"

    # No hardcoded fallback: a guessable default here would let anyone forge
    # auth tokens against a deployment where it was left unset. Set both in
    # .env — see backend/.env.example.
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
