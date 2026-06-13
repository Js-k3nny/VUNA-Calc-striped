FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run lint
RUN npm test

FROM nginx:alpine AS runtime

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/index.html .
COPY --from=builder /app/assets ./assets

RUN sed -i 's/listen 80 default_server/listen 8080 default_server/' nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
