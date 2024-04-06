FROM node:20.12.0-slim
ARG VERSION
WORKDIR /opt/app
COPY mashroom.json package.json package-lock.json ./
RUN if [ "${VERSION}" ] ; then sed -E -i "s/(\"version\": \").+(\")/\1${VERSION}\2/g" package.json ; fi
COPY ./dist ./dist
RUN npm install --omit-dev
EXPOSE 6088
CMD ["node", "dist/server/index.js"]
