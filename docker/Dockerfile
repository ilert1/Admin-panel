# build
FROM node:18.18.2-alpine as build
WORKDIR /app

ARG VITE_API_URL
ARG VITE_BF_MANAGER_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BF_MANAGER_URL=${VITE_BF_MANAGER_URL}
ENV VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL}
ENV VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM}
ENV VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID}

COPY . .

RUN npm install
RUN npm run build


# deploy
FROM nginx:1.23-alpine as deploy

RUN set -ex && \
    # echo -e "http://mirror.yandex.ru/mirrors/alpine/edge/main" >  /etc/apk/repositories && \
    # echo -e "http://mirror.yandex.ru/mirrors/alpine/edge/community" >> /etc/apk/repositories && \
    # apk update && \
    apk add --no-cache tzdata

ENV TZ=Europe/Moscow

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]