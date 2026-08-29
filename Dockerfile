# Railway production Dockerfile for Taka Inside Strapi backend
# Builds the backend service from the repository root.

FROM node:20-alpine

WORKDIR /app

# Force cache bust on every security-sensitive deploy: ensure bootstrap recompiles
ARG DEPLOY_BUST=0
RUN echo "deploy bust: $DEPLOY_BUST"

# Copy backend files (relative to repository root)
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

COPY backend/ .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=1337
EXPOSE 1337

# Graceful shutdown on SIGTERM
STOPSIGNAL SIGTERM

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:1337/api/site-config || exit 1

CMD ["npm", "start"]
