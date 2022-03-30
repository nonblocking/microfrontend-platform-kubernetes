#!/bin/bash

# This will be executed in the Keycloak Pod

KCADM=/opt/jboss/keycloak/bin/kcadm.sh
REALM_DEFINITION=/tmp/realm.json

$KCADM config credentials --server http://localhost:8080/auth --realm Master --user ${KEYCLOAK_ADMIN_USER} --password ${KEYCLOAK_ADMIN_PASSWORD}

# Create Realm and import config
$KCADM create realms -s realm=${KEYCLOAK_REALM} -s enabled=true
$KCADM create partialImport -r ${KEYCLOAK_REALM} -s ifResourceExists=OVERWRITE -o -f $REALM_DEFINITION

# Create users
$KCADM create users -s username=john -s enabled=true -r ${KEYCLOAK_REALM}
$KCADM set-password -r ${KEYCLOAK_REALM} --username john --new-password john
$KCADM create users -s username=admin -s enabled=true -r ${KEYCLOAK_REALM}
$KCADM set-password -r ${KEYCLOAK_REALM} --username admin --new-password admin
$KCADM add-roles --uusername admin --rolename mashroom-admin -r ${KEYCLOAK_REALM}


# Disable SSL required for Master
# DON'T do this in a real live setup!
$KCADM  update realms/Master -s sslRequired=NONE
$KCADM  update realms/${KEYCLOAK_REALM} -s sslRequired=NONE
