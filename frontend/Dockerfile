# build stage
FROM node:22-alpine AS build

WORKDIR /opt/app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_BACKEND_URL

ENV VITE_ENV=prod
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN npm run build


# run stage
FROM node:22-alpine AS run

WORKDIR /opt/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/server.js ./server.js

EXPOSE 3000

CMD ["node", "server.js"]
