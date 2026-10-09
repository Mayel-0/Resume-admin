# ── Étape 1 : build Vite ────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# L'URL de l'API est figée dans le bundle au moment du build.
# Pour la changer : docker build --build-arg VITE_API_URL=https://...
ARG VITE_API_URL=https://mael-llado.com
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Étape 2 : Nginx sert le dossier dist ────────────────────
FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
