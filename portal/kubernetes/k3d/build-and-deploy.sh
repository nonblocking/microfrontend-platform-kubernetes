#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/../../../k3d/set-env.sh

PORTAL_DIRECTORY=$(dirname "$DIRECTORY")
PORTAL_DIRECTORY=$(dirname "$PORTAL_DIRECTORY")

PACKAGE_VERSION=$(node -p -e "require('${PORTAL_DIRECTORY}/package.json').version")
TIMESTAMP=`date +%Y%m%d%H%M%S`
export VERSION="${PACKAGE_VERSION}-${TIMESTAMP}"

echo "Building and deploying Portal $VERSION"

npm install --prefix $PORTAL_DIRECTORY

docker build --build-arg VERSION=$VERSION -t mashroom-portal:latest -t k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/mashroom-portal:latest -t k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/mashroom-portal:$VERSION $PORTAL_DIRECTORY
docker push k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/mashroom-portal:latest
docker push k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/mashroom-portal:$VERSION

envsub $DIRECTORY/mashroom-portal-deployment_template.yaml $DIRECTORY/mashroom-portal-deployment.yaml
envsub $DIRECTORY/mashroom-portal-service_template.yaml $DIRECTORY/mashroom-portal-service.yaml
kubectl apply -f $DIRECTORY/mashroom-portal-deployment.yaml
kubectl apply -f $DIRECTORY/mashroom-portal-service.yaml

echo "Portal will be available at: http://localhost:${NODE_PORT_PORTAL} (takes some time after the first deployment)"
