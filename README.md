# Plantiz

**Live site: [plantiz.vercel.app](https://plantiz.vercel.app/)**

A field guide to over 1,000 plant species, with:

- **Plant library**: every species in a drop-down with its light, water,
  care, hardiness and height, filterable by name, group, setting and care.
- **Recommendations**: describe where a plant will live and get up to five
  matches, each with a confidence score (scikit-learn, cosine similarity).
- **Identification**: upload a photo and [Pl@ntNet](https://plantnet.org)
  suggests the species, with a confidence score.

```
frontend/   Vite + React, prerendered to static HTML (see frontend/README.md)
backend/    FastAPI API: accounts, recommendations, identification
data/       plants.csv, the dataset both read
nginx/      NGINX image: serves the site, load-balances /api
api/        Vercel entry point for the backend
DESIGN.md   The design system the site is built on
```

## Develop

Two terminals:

```bash
# Backend: http://localhost:8000 (see backend/README.md for .env)
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload

# Frontend: http://localhost:5173, proxies /api to the backend
cd frontend
npm install
npm run dev
```

Tests: `pytest` in `backend/`. Lint: `npm run lint` in `frontend/`.

## Deploy

### Docker, with NGINX load balancing

```bash
cp .env.example .env     # set POSTGRES_PASSWORD and JWT_SECRET
docker compose up -d --build
```

NGINX listens on port 80 (`HTTP_PORT`). It serves the prerendered pages and
spreads `/api` requests across `BACKEND_REPLICAS` FastAPI containers (3 by
default), using least connections, retrying another replica when one is
down. A one-off `migrate` service creates the database tables before the
replicas start. Postgres keeps its data in the `postgres_data` volume.

### Vercel

`vercel.json` builds the frontend into static files and runs the backend as a
Python function at `/api` (`api/index.py`). Set these environment variables in
the Vercel project:

- `DATABASE_URL`: a hosted Postgres, e.g. `postgresql+psycopg://...`
- `JWT_SECRET`
- `PLANTNET_API_KEY` (optional; identification is off without it)

Vercel functions accept request bodies up to 4.5 MB. The identify page
shrinks photos in the browser before uploading, so typical phone photos fit.
