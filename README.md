# Plantiz

An AI-powered plant site with two features:

- **Recommendations** — describe your light, humidity, temperature, space, and experience level; a rule-based scoring engine ranks houseplants from a curated dataset that will actually thrive in that environment.
- **Identification** — upload a photo of a plant and the [Pl@ntNet API](https://plantnet.org) identifies the species, enriched with local care info when we recognize it.

Stack: React (Vite) + Bootstrap 5 frontend, FastAPI backend.

## Quick start

Two terminals:

```bash
# Terminal 1 — backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

To enable real plant identification, add a free [Pl@ntNet API key](https://my.plantnet.org) to `backend/.env` — see `backend/README.md` for details. Recommendations work immediately with no API key.
