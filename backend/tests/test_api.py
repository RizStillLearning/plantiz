from app.services.plantnet_client import to_candidates

PNG_HEADER = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32


def test_signup_login_and_me(client):
    signup = client.post(
        "/api/auth/signup",
        json={"name": "  Ivy Green ", "email": "Ivy@Example.com", "password": "pothos-123"},
    )
    assert signup.status_code == 201
    assert signup.json()["user"] == {**signup.json()["user"], "name": "Ivy Green", "email": "ivy@example.com"}

    duplicate = client.post(
        "/api/auth/signup", json={"name": "Ivy", "email": "ivy@example.com", "password": "pothos-123"}
    )
    assert duplicate.status_code == 409

    wrong = client.post("/api/auth/login", json={"email": "ivy@example.com", "password": "nope-nope"})
    assert wrong.status_code == 401

    login = client.post("/api/auth/login", json={"email": "IVY@example.com", "password": "pothos-123"})
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.json()["name"] == "Ivy Green"


def test_signup_rejects_short_password(client):
    response = client.post("/api/auth/signup", json={"name": "A", "email": "a@example.com", "password": "short"})
    assert response.status_code == 422


def test_overlong_password_fails_login_without_crashing(client):
    response = client.post("/api/auth/login", json={"email": "ivy@example.com", "password": "é" * 100})
    assert response.status_code == 401


def test_recommend_requires_login(client):
    body = {"setting": "indoor", "light": "low light", "water": "low", "care_level": "easy", "space": "small"}
    assert client.post("/api/recommend", json=body).status_code == 401


def test_recommend_returns_scored_plants(client, auth_headers):
    body = {"setting": "indoor", "light": "low light", "water": "low", "care_level": "easy", "space": "small"}
    response = client.post("/api/recommend", json=body, headers=auth_headers)

    assert response.status_code == 200
    results = response.json()["results"]
    assert 1 <= len(results) <= 5
    assert {"plant", "confidence"} <= set(results[0])


def test_outdoor_recommendation_needs_a_zone(client, auth_headers):
    body = {"setting": "outdoor", "light": "full sun", "water": "low", "care_level": "easy", "space": "small"}
    response = client.post("/api/recommend", json=body, headers=auth_headers)
    assert response.status_code == 422


def test_identify_rejects_files_that_are_not_images(client, auth_headers):
    response = client.post(
        "/api/identify",
        files={"image": ("notes.png", b"definitely not a png", "image/png")},
        headers=auth_headers,
    )
    assert response.status_code == 422


def test_identify_without_api_key_explains_setup(client, auth_headers):
    response = client.post(
        "/api/identify", files={"image": ("leaf.png", PNG_HEADER, "image/png")}, headers=auth_headers
    )
    assert response.status_code == 503


def test_plantnet_results_link_to_local_plants():
    payload = {
        "results": [
            {
                "score": 0.91,
                "species": {
                    "scientificNameWithoutAuthor": "Monstera deliciosa",
                    "commonNames": ["Swiss cheese plant"],
                    "family": {"scientificNameWithoutAuthor": "Araceae"},
                },
            },
            {"score": 0.02, "species": {"scientificNameWithoutAuthor": "Nonexistus imaginarius"}},
        ]
    }

    first, second = to_candidates(payload)

    assert first.plant is not None and first.plant.id == "monstera"
    assert first.family == "Araceae"
    assert first.confidence == 0.91
    assert second.plant is None
