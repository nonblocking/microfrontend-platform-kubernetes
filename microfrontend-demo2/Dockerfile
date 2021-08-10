FROM node:14.17.4-slim
WORKDIR /opt/app
COPY package.json package-lock.json ./
COPY ./dist ./dist
RUN npm ci --production
EXPOSE 6089
CMD ["npm", "run", "start"]
