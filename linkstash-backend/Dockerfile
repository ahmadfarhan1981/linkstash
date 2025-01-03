# Check out https://hub.docker.com/_/node to select a new base image
FROM docker.io/library/node:20.11-slim

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3030

EXPOSE ${PORT}
CMD [ "bash", "./docker-entrypoint.sh" ]

LABEL org.opencontainers.image.authors="paan@linkstashapp.com" \
      org.opencontainers.image.title="LinkStash Backend" \
      org.opencontainers.image.description="Backend service for LinkStash: Your Self-Hosted Bookmark Manager." \
      org.opencontainers.image.url="https://github.com/ahmadfarhan1981/linkstash"

