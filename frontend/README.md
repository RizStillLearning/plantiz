# Plantiz frontend

Vite + React, rendered to static HTML at build time. React only runs in the
browser for the few components that need it (the forms). Styling is plain
CSS; every design token lives in `src/styles/tokens.css` (see `../DESIGN.md`).

## Run

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173, pages rendered per request
npm run build    # static HTML + assets in dist/
npm run preview  # serves dist/
npm run lint
```

`/api` is proxied to the backend at `http://localhost:8000` in dev and
preview; set `PLANTIZ_API_URL` to point elsewhere. In production the API is
on the same origin (NGINX or Vercel). Set `VITE_API_BASE_URL` at build time
only if it is not.

## How pages are built

- `src/entry-server.jsx` lists every route with its page component, title, and:
  - `access`: `guest` pages (welcome, log in, sign up) send signed-in visitors
    to `/plants`; `member` pages send everyone else to log in. Both checks are
    tiny inline scripts in `<head>` (`src/lib/guard.js`), so the wrong page
    never paints.
  - `client`: whether the page loads `src/client/main.js`. The welcome and 404
    pages ship no JavaScript.
- In dev, the `staticPages` plugin in `vite.config.js` renders the requested
  route on every request.
- `npm run build` bundles CSS, fonts and client code (`vite build`), bundles
  the renderer (`vite build --ssr`), then `scripts/prerender.js` writes one
  file per route: `dist/index.html`, `dist/plants.html` and so on, plus
  `dist/404.html`.
- Plant data is read from `../data/plants.csv` (alias `@data`) while pages
  render. It never ships to the browser; islands get what they need as props.

## Islands

Interactive components live in `src/islands/` and are wrapped in
`<Island name=... component=... props=...>` on the page. The server renders
them like any other markup; in the browser `src/client/main.js` loads React
and the matching island from `src/islands/registry.js`, then hydrates it.

- `LoginForm`, `SignupForm`: validation, errors, session storage
- `RecommendForm`: the recommendation questions and results
- `IdentifyForm`: photo upload (shrunk in the browser first) and results

The plant library's filters are a plain script (`src/client/plantLibrary.js`)
over the prerendered list, so that page loads no React.
