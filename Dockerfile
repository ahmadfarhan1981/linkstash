FROM docker.io/library/node:20.11-slim AS base
RUN corepack enable && corepack prepare pnpm@10.6.1 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc /app/


WORKDIR /app


FROM base AS backend-deps
COPY apps/linkstash-backend/package.json apps/linkstash-backend/.npmrc /app/apps/linkstash-backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=linkstash-backend --shamefully-hoist --frozen-lockfile



FROM backend-deps AS build-backend
RUN mkdir -p apps/linkstash-backend/node_modules
COPY apps/linkstash-backend/  apps/linkstash-backend/
COPY --from=backend-deps /app/apps/linkstash-backend/node_modules/ apps/linkstash-backend/node_modules/
COPY --from=backend-deps /app/node_modules/ node_modules/
RUN pnpm --filter=linkstash-backend run build 
RUN pnpm  --filter=linkstash-backend --prod deploy /prod/linkstash-backend


# Check out https://hub.docker.com/_/node to select a new base image
FROM docker.io/library/node:20.11-slim AS linkstash-backend

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app 

WORKDIR /home/node/app

COPY --from=build-backend --chown=node /prod/linkstash-backend/. .
RUN chmod +x docker-entrypoint.sh
# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3030

EXPOSE ${PORT}
CMD [ "bash", "./docker-entrypoint.sh" ]

LABEL org.opencontainers.image.authors="paan@linkstashapp.com" \
      org.opencontainers.image.title="LinkStash Backend" \
      org.opencontainers.image.description="Backend service for LinkStash: Your Self-Hosted Bookmark Manager." \
      org.opencontainers.image.url="https://github.com/ahmadfarhan1981/linkstash"


FROM base AS frontend-deps 
COPY apps/linkstash-frontend/package.json apps/linkstash-frontend/.npmrc /app/apps/linkstash-frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=linkstash-frontend --shamefully-hoist --frozen-lockfile

FROM frontend-deps AS build-frontend
RUN mkdir -p apps/linkstash-frontend/node_modules
COPY apps/linkstash-frontend/  apps/linkstash-frontend/
COPY --from=frontend-deps /app/apps/linkstash-frontend/node_modules/ apps/linkstash-frontend/node_modules/
COPY --from=frontend-deps /app/node_modules/ node_modules/
RUN pnpm --filter=linkstash-frontend run build 


FROM node:21.1-slim AS linkstash-frontend

WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build-frontend /app/apps/linkstash-frontend/public ./apps/linkstash-frontend/public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build-frontend --chown=nextjs:nodejs /app/apps/linkstash-frontend/.next/standalone ./
COPY --from=build-frontend --chown=nextjs:nodejs /app/apps/linkstash-frontend/.next/static ./apps/linkstash-frontend/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

#  # server.js is created by next build from the standalone output
#  # https://nextjs.org/docs/pages/api-reference/next-config-js/output
 CMD HOSTNAME="0.0.0.0" cd apps/linkstash-frontend && node server.js

 LABEL org.opencontainers.image.authors="paan@linkstashapp.com" \
      org.opencontainers.image.title="LinkStash Frontend" \
      org.opencontainers.image.description="Frontend application for LinkStash: Your Self-Hosted Bookmark Manager." \
      org.opencontainers.image.url="https://github.com/ahmadfarhan1981/linkstash"
