# Plantiz backend (FastAPI)

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
```

## Configure plant identification

The `/api/identify` endpoint calls the [Pl@ntNet API](https://my.plantnet.org). To enable it:

1. Create a free account at https://my.plantnet.org
2. Go to "My account" → create an application to get an API key
3. Put the key in `backend/.env`:
   ```
   PLANTNET_API_KEY=your-key-here
   ```

Without a key, `/api/identify` still runs and returns a clear 503 error explaining how to set one up — the rest of the app works normally.

## Run

```bash
uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Endpoints

- `GET /api/health` — health check
- `POST /api/recommend` — body: `{light, humidity, temperature_c, space, experience, pets}` → ranked plant matches from the local dataset (`app/data/plants.json`)
- `POST /api/identify` — multipart form: `image` (JPEG/PNG file), `organ` (`leaf`/`flower`/`fruit`/`bark`/`auto`) → species candidates from Pl@ntNet, enriched with local care info when we recognize the species
