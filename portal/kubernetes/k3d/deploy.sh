#!/bin/bash

source ../../../k3d/set-env.sh

echo "Deploying Mashroom Portal on Kubernetes cluster ${CLUSTER}"

# Add Service account
kubectl apply -f ../list-services-cluster-role.yaml
kubectl apply -f ../mashroom-portal-service-account.yaml
kubectl apply -f ../mashroom-portal-service-account-role-binding.yaml

# Create deployment
envsub mashroom-portal-deployment_template.yaml mashroom-portal-deployment.yaml
kubectl apply -f ./mashroom-portal-deployment.yaml

# Create the Service and Ingress
envsub mashroom-portal-service_template.yaml mashroom-portal-service.yaml
kubectl apply -f ./mashroom-portal-service.yaml

echo "Portal is available at: http://${CLUSTER_IP:$NODE_PORT_PORTAL} (takes some time after the first deployment)"
