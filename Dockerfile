# syntax=docker/dockerfile:1
FROM node:24-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS source
COPY . .

FROM source AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM source AS test
RUN npm test

FROM source AS build
RUN --mount=type=cache,target=/app/.next/cache npm run build

FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 3000
