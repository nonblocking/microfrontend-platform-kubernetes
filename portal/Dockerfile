FROM node:10-slim
WORKDIR /opt/app
COPY package.json mashroom-starter.js ./
COPY ./config ./config
RUN npm install --production
EXPOSE 5050
CMD ["npm", "run", "start"]
