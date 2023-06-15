#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh

echo "Uninstall Redis..."
helm delete redis --namespace "${COMMON_NAMESPACE}"

echo "Uninstall MongoDB"
kubectl delete -f ${DIRECTORY}/mongo-standalone.yaml
#helm delete mongodb --namespace "${COMMON_NAMESPACE}"

echo "Uninstall Keycloak"
helm delete keycloak --namespace "${COMMON_NAMESPACE}"

echo "Successfully uninstalled common services!"

