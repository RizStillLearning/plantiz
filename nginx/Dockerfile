# Build context is the repo root (see docker-compose.yml).
# Stage 1 prerenders the frontend; stage 2 is NGINX serving those files and
# load-balancing /api across the backend replicas.
FROM node:22.23.4-alpine AS frontend

WORKDIR /srv/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
COPY data /srv/data
# Same origin: the browser calls /api on this server, which proxies it.
ENV VITE_API_BASE_URL=
RUN npm run build

FROM nginx:1.28-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend /srv/frontend/dist /usr/share/nginx/html
