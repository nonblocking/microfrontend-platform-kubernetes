#!/bin/bash

###################################################
# Before you start the script adapt the constants #
# to your needs                                   #
###################################################

export CLUSTER=mashroom-cluster

export COMMON_NAMESPACE="mashroom-common"
export MICROFRONTEND_NAMESPACE="microfrontends1"

export MONGODB_DATABASE=mashroom
export MONGODB_USER=mashroom
export MONGODB_PASSWORD=KUN6FWwT

export REDIS_PASSWORD=BJ-63VLqCT

export KEYCLOAK_ADMIN_USER=admin
export KEYCLOAK_ADMIN_PASSWORD=test
export KEYCLOAK_REALM=test
export KEYCLOAK_CLIENT_ID=mashroom-portal
export KEYCLOAK_CLIENT_SECRET="ba1b09ab-cab1-41c3-ba2d-939ac77a934c"

# K3D related variables
export LOCAL_REGISTRY_NAME=mashroomregistry.localhost
export LOCAL_REGISTRY_PORT=12345
export NODE_PORT_RANGE_FROM=30000
export NODE_PORT_RANGE_TO=30100
export NUM_AGENTS=1

export NODE_PORT_KEYCLOAK=30081
export NODE_PORT_PORTAL=30082
export NODE_PORT_GRAFANA=30083
