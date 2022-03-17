#!/bin/bash

source ./set-env.sh

echo "Building a docker image or the portal and pushing it to your registry"

echo "Installing dependencies"
npm install --prefix $DIRECTORY

echo "Building mashroom-portal:latest"
docker build -t mashroom-portal:latest $DIRECTORY

echo "Tagging mashroom-portal:latest"
docker tag mashroom-portal:latest k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/mashroom-portal:latest

echo "Pushing mashroom-portal:latest"
docker push k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/mashroom-portal:latest
