# CLAUDE.md

> Rules for the AI Agent before building the website.

## Project Overview
A website that provides information about various plant species. The website also features a plant recommendation system based on user's environment. The website also features plant image classification.

## Stack
- Vite + React, pre-rendered to static HTML at build time. No client-side React unless a component truly needs it.
- Plain CSS with custom properties. Tokens are stored in `src/styles/tokens.css`.
- No UI kits or component libraries.
- Scikit-learn for recommendation system.
- FastAPI from Python as backend.

## Design Rules
- Read `references/style-prompt.md` for design reference.
- Once `DESIGN.md` exists, it overrides everything in `references/`. Use only its tokens, and ask before adding a new color, font or size.
- Avoid the generic AI look:
    - no Inter, Roboto or Arial for headings.
    - no purple/blue gradients, glassmorphism or glowing blobs.
    - no three-column icon feature row, no emoji as icons.
    - no stock photos or AI-generated illustrations.
- Accessibility is required: AA contrast, visible focus rings, 44px touch targets, one h1 per page with headings in order, and everything animated must respect `prefers-reduced-motion`.

## Project rules
- The project has to be build monorepo structure, separating `frontend/` and `backend/` folder.
- The website pages can be viewed at `contents/pages.md`.
- The recommendation system rules can be viewed at `contents/recommendation.md`.

## How to Work
- Design the welcome page first, then stop and show me. If I approve the page, continue with the other pages.
- When I ask for a revision, change only that thing. Don't regenerate whole sections.
- Don't edit content/, references/ or this file unless I ask.
- After the website is complete, write `DESIGN.md` from what was built.