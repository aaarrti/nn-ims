FROM node:lts-slim

WORKDIR /ui

COPY . .

RUN npm install --force

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npx", "serve", "build"]