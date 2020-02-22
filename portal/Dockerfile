FROM node:10-slim
WORKDIR /opt/app
COPY package.json package-lock.json mashroom-starter.js ./
COPY ./config ./config
RUN npm ci --production
EXPOSE 5050
CMD ["npm", "run", "start"]
