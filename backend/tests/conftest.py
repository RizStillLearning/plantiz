import os
import tempfile
from pathlib import Path

import pytest

# Settings are read when app modules are imported, so configure a throwaway
# SQLite database and secret before anything imports the app.
_db_dir = tempfile.mkdtemp(prefix="plantiz-tests-")
os.environ["DATABASE_URL"] = f"sqlite:///{Path(_db_dir) / 'test.db'}"
os.environ["JWT_SECRET"] = "test-secret-not-for-production-use-0123456789"
os.environ["PLANTNET_API_KEY"] = ""

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def auth_headers(client: TestClient) -> dict[str, str]:
    response = client.post(
        "/api/auth/signup",
        json={"name": "Fern Gully", "email": f"fern-{os.urandom(4).hex()}@example.com", "password": "monstera123"},
    )
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
