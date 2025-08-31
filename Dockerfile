FROM node:20-alpine AS base
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app

FROM base AS depedency
COPY package*.json .
RUN npm ci --omit=dev && \
    rm -rf node_modules/puppeteer/.local-chromium

FROM base AS build
COPY . .
RUN npm install --frozen-lockfile && \
    npm run build && \
    npm rebuild sharp && \
    rm -rf node_modules/puppeteer/.local-chromium

FROM base AS release
COPY --from=build /app/.output /app/.output
COPY --from=build /app/html /app/.output/server/html
COPY --from=build /app/scripts /app/.output/server/scripts
COPY --from=build /app/drizzle /app/drizzle
COPY --from=build /app/drizzle.config.ts /app/drizzle.config.ts

COPY --from=depedency /app/node_modules /app/node_modules

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

RUN mkdir -p /app/.output/server/storage && \
    chmod 777 /app/.output/server/storage

EXPOSE 3000

CMD [ "node", "--expose-gc", "/app/.output/server/index.mjs" ]