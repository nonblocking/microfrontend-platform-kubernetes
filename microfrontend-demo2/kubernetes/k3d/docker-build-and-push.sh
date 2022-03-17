#!/bin/bash

source ./set-env.sh

DIRECTORY=$(cd `dirname $0` && pwd)
DIRECTORY=$(dirname "$DIRECTORY")
DIRECTORY=$(dirname "$DIRECTORY")

echo "Building a docker image or the microfrontend-demo2 and pushing it to your registry"

echo "Installing dependencies"
npm install --prefix $DIRECTORY

echo "Build"
npm run --prefix $DIRECTORY build

echo "Building microfrontend-demo2:latest"
docker build -t microfrontend-demo2:latest $DIRECTORY

echo "Tagging microfrontend-demo2:latest"
docker tag microfrontend-demo2:latest k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo2:latest

echo "Pushing microfrontend-demo2:latest"
docker push k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo2:latest

