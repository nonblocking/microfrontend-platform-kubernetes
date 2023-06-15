#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh

echo "Creating namespaces"
envsub ${DIRECTORY}/namespaces_template.yaml ${DIRECTORY}/namespaces.yaml
kubectl apply -f ${DIRECTORY}/namespaces.yaml

echo "Deploying Redis..."
# Possible parameters: https://artifacthub.io/packages/helm/bitnami/redis
helm install redis \
  --version "17.11.3" \
  --namespace "${COMMON_NAMESPACE}" \
  --set architecture=standalone,auth.password=${REDIS_PASSWORD} \
    oci://registry-1.docker.io/bitnamicharts/redis

echo "Deploying MongoDB"
envsub ${DIRECTORY}/mongo-standalone_template.yaml ${DIRECTORY}/mongo-standalone.yaml
kubectl apply -f ${DIRECTORY}/mongo-standalone.yaml
# Unfortunately this Helm chart doesn't work on M1, see https://github.com/bitnami/containers/issues/33409
# Possible parameters: https://artifacthub.io/packages/helm/bitnami/mongodb
#helm install mongodb \
#  --version "13.15.1" \
#  --namespace "${COMMON_NAMESPACE}" \
#  --set auth.database=${MONGODB_DATABASE},auth.username=${MONGODB_USER},auth.password=${MONGODB_PASSWORD} \
#    oci://registry-1.docker.io/bitnamicharts/mongodb

echo "Deploying Keycloak with Postgres"
envsub ${DIRECTORY}/../keycloak/test-realm_template.yaml ${DIRECTORY}/../keycloak/test-realm.yaml
kubectl apply -f ${DIRECTORY}/../keycloak/test-realm.yaml

# Possible parameters: https://artifacthub.io/packages/helm/bitnami/keycloak
helm install keycloak \
  --version "15.1.3" \
  --namespace "${COMMON_NAMESPACE}" \
  -f ${DIRECTORY}/keycloak-values.yaml \
  --set auth.adminUser=${KEYCLOAK_ADMIN_USER},auth.adminPassword=${KEYCLOAK_ADMIN_PASSWORD},service.ports.http=${NODE_PORT_KEYCLOAK},service.nodePorts.http=${NODE_PORT_KEYCLOAK} \
  oci://registry-1.docker.io/bitnamicharts/keycloak

echo "Adding keycloak-localhost forward to /etc/hosts - REQUIRES ROOT ACCESS"
sudo $DIRECTORY/setup-keycloak-localhost-forward.sh

echo "Wait until Keycloak is ready..."
$DIRECTORY/wait-until-pod-is-ready.sh keycloak-0 mashroom-common

echo "Keycloak is available at http://localhost:${NODE_PORT_KEYCLOAK}"

echo "Setup platform ConfigMap and Secret..."
envsub ${DIRECTORY}/platform-services-configmap_template.yaml ${DIRECTORY}/platform-services-configmap.yaml
envsub ${DIRECTORY}/platform-services-secrets_template.yaml ${DIRECTORY}/platform-services-secrets.yaml
kubectl apply -f ${DIRECTORY}/platform-services-configmap.yaml
kubectl apply -f ${DIRECTORY}/platform-services-secrets.yaml

echo "Setup Portal service account..."
envsub ${DIRECTORY}/portal-service-account_template.yaml ${DIRECTORY}/portal-service-account.yaml
kubectl apply -f ${DIRECTORY}/portal-service-account.yaml

echo "Successfully setup common services!"
