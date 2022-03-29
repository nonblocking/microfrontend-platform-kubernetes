#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh

echo "Setup helm..."
$DIRECTORY/setup-helm.sh

echo "Creating registry..."
$DIRECTORY/setup-registry.sh

echo "Adding keycloak-localhost forward to /etc/hosts..."
sudo $DIRECTORY/setup-keycloak-localhost-forward.sh

echo "Creating k3d cluster..."
$DIRECTORY/setup-k3d-cluster.sh

echo "Setting kubectl context..."
kubectl config use-context k3d-${CLUSTER}

# echo "Uninstall common services..."
# $DIRECTORY/uninstall-common-services.sh

echo "Setup common services..."
$DIRECTORY/setup-common-services.sh

echo "Wait until keycloak is ready..."
$DIRECTORY/wait-until-pod-is-ready.sh keycloak

echo "Setup realm..."
$DIRECTORY/../keycloak/k3d/setup-mashroom-realm.sh

echo "Setup configmap..."
$DIRECTORY/setup-configmap.sh

echo "Setup service account..."
$DIRECTORY/setup-portal-service-account.sh

echo "Create portal docker image and push to registry"
$DIRECTORY/../portal/kubernetes/k3d/docker-build-and-push.sh

echo "Deploy portal"
$DIRECTORY/../portal/kubernetes/k3d/deploy.sh

echo "Wait until portal is ready..."
$DIRECTORY/wait-until-pod-is-ready.sh mashroom-portal

echo "Create microfrontend-demo1 docker image and push to registry"
$DIRECTORY/../microfrontend-demo1/kubernetes/k3d/docker-build-and-push.sh

echo "Deploy microfrontend-demo1"
$DIRECTORY/../microfrontend-demo1/kubernetes/k3d/deploy.sh

echo "Wait until microfrontend-demo1 is ready..."
$DIRECTORY/wait-until-pod-is-ready.sh microfrontend-demo1

echo "Create microfrontend-demo2 docker image and push to registry"
$DIRECTORY/../microfrontend-demo2/kubernetes/k3d/docker-build-and-push.sh

echo "Deploy microfrontend-demo2"
$DIRECTORY/../microfrontend-demo2/kubernetes/k3d/deploy.sh

echo "Wait until microfrontend-demo2 is ready..."
$DIRECTORY/wait-until-pod-is-ready.sh microfrontend-demo2

echo "Find the portal at http://localhost:30082 (admin/admin) or (john/john)."
