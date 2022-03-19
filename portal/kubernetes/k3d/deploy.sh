#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/../../../k3d/set-env.sh

echo "Deploying Mashroom Portal on Kubernetes cluster ${CLUSTER}"

# Add Service account
kubectl apply -f $DIRECTORY/../list-services-cluster-role.yaml
kubectl apply -f $DIRECTORY/../mashroom-portal-service-account.yaml
kubectl apply -f $DIRECTORY/../mashroom-portal-service-account-role-binding.yaml

# Create deployment
envsub $DIRECTORY/mashroom-portal-deployment_template.yaml $DIRECTORY/mashroom-portal-deployment.yaml
kubectl apply -f $DIRECTORY/mashroom-portal-deployment.yaml

# Create the Service and Ingress
envsub $DIRECTORY/mashroom-portal-service_template.yaml $DIRECTORY/mashroom-portal-service.yaml
kubectl apply -f $DIRECTORY/mashroom-portal-service.yaml

echo "Portal is available at: http://${CLUSTER_IP}:${NODE_PORT_PORTAL} (takes some time after the first deployment)"
