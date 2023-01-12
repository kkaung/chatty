FROM node:19.1.0-alpine3.16 AS builder

WORKDIR /app
COPY package*.json .
RUN yarn install
COPY . .

EXPOSE 3000

ENTRYPOINT [ "yarn", "start" ] 