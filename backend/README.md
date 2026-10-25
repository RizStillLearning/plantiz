# Plantiz backend (FastAPI)

Accounts, plant recommendations (scikit-learn) and plant identification
(Pl@ntNet). Plant data comes from `../data/plants.csv`, the same file the
frontend prerenders from.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env               # Windows: copy .env.example .env
```

In `.env`, set `JWT_SECRET` (`openssl rand -hex 32`) and `DATABASE_URL`. For a
Postgres database, run `docker compose up -d db` from the repo root. For quick
local work, `DATABASE_URL=sqlite:///./plantiz.db` also works.

## Run

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`, with interactive docs at
`http://localhost:8000/api/docs`. The frontend dev server proxies `/api` here.

## Test

```bash
pytest
```

Tests use a throwaway SQLite database and need no `.env`.

## Plant identification

`/api/identify` calls the [Pl@ntNet API](https://my.plantnet.org):

1. Create a free account at https://my.plantnet.org.
2. Under "My account", create an application to get an API key.
3. Set `PLANTNET_API_KEY` in `.env`.

Without a key the endpoint answers 503 with a short explanation; everything
else keeps working.

## Endpoints

All under `/api`. Endpoints marked * need `Authorization: Bearer <token>`.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/api/health` | | `{status}` |
| POST | `/api/auth/signup` | `{name, email, password}` | `{access_token, user}` |
| POST | `/api/auth/login` | `{email, password}` | `{access_token, user}` |
| GET | `/api/auth/me` * | | `{id, name, email}` |
| POST | `/api/recommend` * | `{setting, light, water, care_level, space, zone?, category?}` | up to 5 `{plant, confidence}` |
| POST | `/api/identify` * | multipart: `image` (JPEG/PNG), `organ` | up to 5 candidates with `confidence` |

## How recommendations work

`app/services/recommender.py`, following `contents/recommendation.md`:

1. **Filters.** Only plants for the chosen setting (indoor or outdoor).
   Outdoors, the plant's hardiness zone range must include the visitor's
   zone; annuals (no zone range) always pass. If the visitor picked a plant
   group, only that group.
2. **Encoding (scikit-learn).** Ordinal features are label encoded in their
   natural order with `OrdinalEncoder`: water (low, moderate, high), care
   level (easy, moderate, challenging) and size (small, medium, large, from
   mature height). Categorical features are one-hot encoded: plant group with
   `OneHotEncoder`, light with `MultiLabelBinarizer`, since a plant can
   tolerate several light levels.
3. **K-nearest neighbours with cosine similarity.** The visitor's answers go
   through the same fitted encoders. `NearestNeighbors(metric="cosine")`,
   fitted on the plants that passed the filters, finds the 5 nearest to the
   answers. Cosine distance is 1 − cosine similarity, and the similarity is
   the confidence score. Plants exactly as near as the 5th (common, since
   many share the same needs) are gathered with `radius_neighbors`, and ties
   go to the better-known plant.

Two details make the score meaningful:

- Each label-encoded ordinal value is placed on a quarter circle (angle =
  code / (levels - 1) × 90°). Plain codes would make the lowest level (code 0)
  invisible to cosine similarity; as angles, equal values agree fully, one
  step apart agree 71%, opposite ends 0%.
- Each feature's columns are scaled to unit length and weighted (light 3,
  water 2, care 2, plant group 2, size 1.5). The cosine similarity is then
  the weighted average of the per-feature agreement.

## Docker

`Dockerfile` builds from the repo root so the image includes `data/`. See the
root `docker-compose.yml`, which runs several replicas behind NGINX.
