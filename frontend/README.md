# Plantiz frontend (React + Vite + Bootstrap)

## Setup

```bash
cd frontend
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux
```

`.env` only needs `VITE_API_BASE_URL` if the backend isn't running at `http://localhost:8000`.

## Run

```bash
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend (see `../backend/README.md`) is running first.

## Build

```bash
npm run build
```

## Pages

- `/` — home
- `/recommend` — environment form → ranked plant recommendations
- `/identify` — photo upload → AI species identification (via the backend's Pl@ntNet integration)
