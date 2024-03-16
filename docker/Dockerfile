# build
FROM node:18.18.2-alpine as build
WORKDIR /app

ARG VITE_API_URL

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

RUN npm install
RUN npm run build


# deploy
FROM nginx:1.23-alpine as deploy

RUN apk add --no-cache tzdata
ENV TZ=Europe/Moscow

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]