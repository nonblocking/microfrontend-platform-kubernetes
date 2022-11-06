FROM node:16.18.0-slim
WORKDIR /opt/app
COPY package.json package-lock.json mashroom-starter.js ./
COPY ./config ./config
RUN npm ci --production
EXPOSE 5050
CMD ["node", "mashroom-starter"]
