#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/../../../k3d/set-env.sh

DIRECTORY=$(dirname "$DIRECTORY")
DIRECTORY=$(dirname "$DIRECTORY")

echo "Building a docker image or the microfrontend-demo1 and pushing it to your registry"

echo "Installing dependencies"
npm install --prefix $DIRECTORY

echo "Build"
npm run --prefix $DIRECTORY build

echo "Building microfrontend-demo1:latest"
docker build -t microfrontend-demo1:latest $DIRECTORY

echo "Tagging microfrontend-demo1:latest"
docker tag microfrontend-demo1:latest k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo1:latest

echo "Pushing microfrontend-demo1:latest"
docker push k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo1:latest

