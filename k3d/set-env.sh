#!/bin/bash

###################################################
# Before you start the script adapt the constants #
# to your needs                                   #
###################################################

# At least change the following to properties!
export PROJECT_ID=mashroom-demo
export ZONE=europe-west4-a

export CLUSTER=mashroom-cluster

export MONGODB_DATABASE=mashroom
export MONGODB_USER=mashroom
export MONGODB_PASSWORD=KUN6FWwT

export MYSQL_DATABASE=keycloak
export MYSQL_USER=keycloak
export MYSQL_PASSWORD=4FqUQjaq

export KEYCLOAK_ADMIN_USER=admin
export KEYCLOAK_ADMIN_PASSWORD=test
export KEYCLOAK_REALM=Mashroom
export KEYCLOAK_CLIENT_ID=mashroom-portal
export KEYCLOAK_CLIENT_SECRET="copy from keycloak after setup"

export RABBITMQ_USER=rabbitmq
export RABBITMQ_PASSWORD=BJ-63VLqCT

# K3D related variables
export LOCAL_REGISTRY_NAME=mashroomregistry.localhost
export LOCAL_REGISTRY_PORT=12345
export NODE_PORT_RANGE_FROM=30000
export NODE_PORT_RANGE_TO=30100
export NUM_AGENTS=1
export CLUSTER_IP=localhost
export NODE_PORT_KEYCLOAK=30081
export NODE_PORT_PORTAL=30082


