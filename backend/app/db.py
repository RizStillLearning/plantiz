from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    # Imported for its side effect: registers the tables on Base.metadata.
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)

    # create_all never alters existing tables. Databases created before sign-up
    # asked for a name are missing that column, so add it in place.
    columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "name" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT ''"))


def get_db() -> Generator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
