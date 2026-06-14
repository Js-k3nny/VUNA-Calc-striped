FROM node:20-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run lint && npm test

FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=test /app/index.html /usr/share/nginx/html/
COPY --from=test /app/calculator /usr/share/nginx/html/calculator
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=2 \
  CMD curl -s -o /dev/null http://localhost/ || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
