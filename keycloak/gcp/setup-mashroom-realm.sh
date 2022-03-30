#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source ${DIRECTORY}/../../gcp/set-env.sh

echo "Setting up Realm ${KEYCLOAK_REALM}"

# Set auth on kubectl and docker
gcloud container clusters get-credentials "${CLUSTER}" --zone "${ZONE}"
gcloud auth configure-docker

# Determine Portal URL
export PORTAL_IP=`gcloud compute addresses describe portal-global-ip --global --format='get(address)'`
export PORTAL_URL="http://${PORTAL_IP}"

# Prepare the Realm definitions and copy it to one of the Keycloak Pods
envsub ${DIRECTORY}/realm-template.json ${DIRECTORY}/realm.json
kubectl cp ${DIRECTORY}/realm.json keycloak-0:/tmp

# Prepare the setup script and copy it to one of the Keycloak Pods
envsub ${DIRECTORY}/keycloak-update-template.sh ${DIRECTORY}/keycloak-update.sh
chmod +x ${DIRECTORY}/keycloak-update.sh
kubectl cp ${DIRECTORY}/keycloak-update.sh keycloak-0:/tmp

# Exec update script on the Keycloak Pod
kubectl exec keycloak-0 -- /tmp/keycloak-update.sh
