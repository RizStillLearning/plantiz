# Plantiz

**Live site: [plantiz.vercel.app](https://plantiz.vercel.app/)**

A field guide to over 1,000 plant species, with:

- **Plant library**: every species in a drop-down with its light, water,
  care, hardiness and height, filterable by name, group, setting and care.
- **Recommendations**: describe where a plant will live and get up to five
  matches, each with a confidence score (scikit-learn k-nearest neighbours,
  cosine similarity).
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

## Tech stack

Versions as pinned in `frontend/.nvmrc`, `frontend/package-lock.json`,
`backend/requirements.txt` and the Dockerfiles.

### Frontend

| Tool | Version | Used for |
| --- | --- | --- |
| Node.js | 22.23.4 | Dev server and build |
| npm | 10.9.9 | Packages (bundled with Node.js) |
| React | 19.3.1 | Page components, prerendered to HTML; forms hydrate in the browser |
| Vite | 8.3.5 | Dev server, bundling and server rendering |
| @vitejs/plugin-react | 6.1.2 | JSX support in Vite |
| Fraunces and Inter (`@fontsource-variable`) | 5.3.0 | Self-hosted fonts |
| oxlint | 1.89.0 | Linting |

Styling is plain CSS with custom properties; there is no UI kit.

### Backend

| Tool | Version | Used for |
| --- | --- | --- |
| Python | 3.13 (Docker), 3.12 (Vercel) | Runtime |
| FastAPI | 0.162.0 | API |
| Uvicorn | 0.54.0 | ASGI server |
| pydantic-settings | 2.16.1 | Configuration from environment variables |
| SQLAlchemy | 2.1.6 | Database access |
| psycopg | 3.3.6 | PostgreSQL driver |
| scikit-learn | 1.9.1 | Recommendations: encoders and k-nearest neighbours |
| pandas | 3.1.0 | Loading `data/plants.csv` |
| NumPy | 2.5.4 | Feature vectors |
| bcrypt | 5.0.0 | Password hashing |
| PyJWT | 2.15.1 | Login tokens |
| httpx | 0.28.1 | Calls to the Pl@ntNet API |
| python-multipart | 0.0.32 | Photo uploads |
| email-validator | 2.3.0 | Email address validation |
| pytest | 9.1.1 | Tests |

### Services and deployment

| Tool | Version | Used for |
| --- | --- | --- |
| PostgreSQL | 17 | Database (`postgres:17-alpine`) |
| NGINX | 1.28 | Serves the site and load-balances `/api` (`nginx:1.28-alpine`) |
| Docker Compose | | Self-hosted stack (`docker-compose.yml`) |
| Vercel | | Hosting for the live site |
| Pl@ntNet API | v2 | Plant identification |

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
