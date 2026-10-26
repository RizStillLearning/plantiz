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
- The plant classification calls PlantNet API to fetch the predicted species and confidence score.

## How to Work
- Avoid using AI-looking codes and complicated logic in both frontend and backend:
    - Comments and documentation
        - Comments that say what the next line obviously does (# Increment the counter) rather than why it’s done.
        - Full docstrings on trivial functions, often just restating the function name (“Process the data. Args: data: The data to process.”).
        - Banner comments that split a short script into numbered steps (# --- Step 1: Load the data ---).
        - Comments that refer to the chat that produced the code: # Updated to fix the bug, # NEW: added validation, # Changed from X as requested.

    - Error handling
        - try/except Exception around everything, which prints a generic message and returns None or an empty value.
        - Silent fallbacks that hide real problems, like .get(key, "Unknown") everywhere or default values that let broken input slip through.
        - Checks for conditions that can’t actually happen given how the function is called.

    - Structure and style
        - Over-engineering: classes, config objects, or abstraction layers for a 20-line task.
        - Textbook uniformity. Every function has the same shape and naming style, and none of the small quirks a human leaves behind.
        - Generic names like data, result, process_data, handle_request, helper_function.
        - An if __name__ == "__main__": block with “example usage,” even in code meant to be imported.

    - Output and logging
        - Emoji in print or log statements (✅ Success!, 🚀 Starting..., ❌ Error:).
        - Chatty progress messages like “Processing complete!” in code that doesn’t need them.

    - Mismatch with the codebase
        - It reimplements a helper the project already has, or ignores the repo’s conventions for logging, error types, or file layout.
        - Unused imports, or APIs that don’t exist or are deprecated, because the model guessed at a library’s interface.
        - Placeholder leftovers: your_api_key_here, example.com, # TODO: implement this, or stray markdown fences.

    - Tests
        - Tests that mostly check mocks, assert something trivially true, or were adjusted to match the code’s behavior instead of the intended behavior.

- Design the welcome page first, then stop and show me. If I approve the page, continue with the other pages.
- When I ask for a revision, change only that thing. Don't regenerate whole sections.
- Don't edit `content/`, `references/` or this file unless I ask.
- After the website is complete, write `DESIGN.md` from what was built.

## Deployment
This website will be deployed on Vercel. Write the Docker configuration and use NGINX as load-balancer.