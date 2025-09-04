ARG NODE_VERSION=18.18-alpine3.18

FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/app
RUN apk add --no-cache curl python3 make g++ sqlite sqlite-dev
ARG USER_ID=1000
ARG USER_NAME=node
RUN chown -R ${USER_NAME}: /usr/src/app
ENV TZ=Europe/Madrid
ENV NODE_ICU_DATA=node_modules/full-icu

FROM base AS development
ENV PATH="${PATH}:/usr/src/app/node_modules/.bin"
ENV PROMPT="%B%F{cyan}%n%f@%m:%F{yellow}%~%f %F{%(?.green.red[%?] )}>%f %b"
RUN apk add --no-cache build-base zsh
RUN if [ ${USER_ID} -ne 1000 ]; then \
  apk add --no-cache -t volatile shadow \
  && groupmod -g ${USER_ID} ${USER_NAME} \
  && usermod -u ${USER_ID} -g ${USER_ID} ${USER_NAME} \
  && apk del --purge volatile; \
  fi
USER ${USER_NAME}

FROM base AS runtime
USER ${USER_NAME}
COPY package*.json ./
ENV npm_config_build_from_source=true
RUN --mount=type=secret,id=npmrc,target=/usr/src/app/.npmrc,uid=${USER_ID} npm ci
COPY . .
ENV NODE_ENV=production
CMD ["node", "index.js"]
