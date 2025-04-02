FROM node:22.14.0-slim
ARG VERSION
WORKDIR /opt/app
COPY package.json package-lock.json mashroom-starter.js ./
RUN if [ "${VERSION}" ] ; then sed -E -i "s/(\"version\": \").+(\")/\1${VERSION}\2/g" package.json ; fi
COPY ./config ./config
RUN npm install --omit-dev
EXPOSE 5050
CMD ["node", "mashroom-starter"]
