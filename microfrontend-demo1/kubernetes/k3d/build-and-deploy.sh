#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/../../../k3d/set-env.sh

MICROFRONTEND_DIRECTORY=$(dirname "$DIRECTORY")
MICROFRONTEND_DIRECTORY=$(dirname "$MICROFRONTEND_DIRECTORY")

PACKAGE_VERSION=$(node -p -e "require('${MICROFRONTEND_DIRECTORY}/package.json').version")
TIMESTAMP=`date +%Y%m%d%H%M%S`
export VERSION="${PACKAGE_VERSION}-${TIMESTAMP}"

echo "Building and deploying microfrontend-demo1 $VERSION"

npm install --prefix $MICROFRONTEND_DIRECTORY
npm run --prefix $MICROFRONTEND_DIRECTORY build

docker build --build-arg VERSION=$VERSION -t microfrontend-demo1:latest -t k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo1:latest -t k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo1:$VERSION $MICROFRONTEND_DIRECTORY
docker push k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo1:latest
docker push k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}/microfrontend-demo1:$VERSION

envsub $DIRECTORY/microservice-demo1-deployment_template.yaml $DIRECTORY/microservice-demo1-deployment.yaml
envsub $DIRECTORY/microservice-demo1-service_template.yaml $DIRECTORY/microservice-demo1-service.yaml
kubectl apply -f $DIRECTORY/microservice-demo1-deployment.yaml
kubectl apply -f $DIRECTORY/microservice-demo1-service.yaml

echo "Deployed microfrontend-demo1 $VERSION. It can take up to 60sec until the Portal registers the new version (refreshIntervalSec)"

