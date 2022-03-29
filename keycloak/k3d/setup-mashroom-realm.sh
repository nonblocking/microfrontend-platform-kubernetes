#!/bin/bash
DIRECTORY=$(cd `dirname $0` && pwd)

source ${DIRECTORY}/../../k3d/set-env.sh

echo "Setting up Realm ${KEYCLOAK_REALM}"


# Prepare the Realm definitions and copy it to one of the Keycloak Pods
envsub ${DIRECTORY}/realm-template.json ${DIRECTORY}/realm.json
kubectl cp ${DIRECTORY}/realm.json keycloak-0:/tmp

# Prepare the setup script and copy it to one of the Keycloak Pods
envsub ${DIRECTORY}/keycloak-update-template.sh ${DIRECTORY}/keycloak-update.sh
chmod +x ${DIRECTORY}/keycloak-update.sh
kubectl cp ${DIRECTORY}/keycloak-update.sh keycloak-0:/tmp

# Exec update script on the Keycloak Pod
kubectl exec keycloak-0 -- /tmp/keycloak-update.sh
