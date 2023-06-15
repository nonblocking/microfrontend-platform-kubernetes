#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh

echo "Creating registry..."
$DIRECTORY/setup-registry.sh

echo "Creating k3d cluster..."
$DIRECTORY/setup-k3d-cluster.sh

echo "Setting kubectl context..."
kubectl config use-context k3d-${CLUSTER}

# echo "Uninstall common services..."
# $DIRECTORY/uninstall-common-services.sh

echo "Setup common services..."
$DIRECTORY/setup-common-services.sh

echo "Build and deploy Portal"
$DIRECTORY/../portal/kubernetes/k3d/build-and-deploy.sh

echo "Build and deploy microfrontend-demo1"
$DIRECTORY/../microfrontend-demo1/kubernetes/k3d/build-and-deploy.sh

echo "Build and deploy microfrontend-demo2"
$DIRECTORY/../microfrontend-demo2/kubernetes/k3d/build-and-deploy.sh

echo "Wait until portal is ready..."
$DIRECTORY/wait-until-pod-is-ready.sh mashroom-portal

echo "Portal is available at http://localhost:30082 (admin/admin) or (john/john)"
