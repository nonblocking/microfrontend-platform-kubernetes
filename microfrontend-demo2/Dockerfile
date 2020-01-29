FROM node:10-slim
WORKDIR /opt/app
COPY package.json ./
COPY ./dist ./dist
RUN npm install --production
EXPOSE 6089
CMD ["npm", "run", "start"]
