# build stage
FROM node:20-alpine AS build

WORKDIR /opt/app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_ADMIN_EMAIL
ENV VITE_ADMIN_EMAIL=$VITE_ADMIN_EMAIL

RUN npm run build


# run stage
FROM node:20-alpine AS run

WORKDIR /opt/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/server.js ./server.js

EXPOSE 3000

CMD ["node", "server.js"]
