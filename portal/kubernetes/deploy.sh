#!/bin/bash

source ../../set-env.sh

echo "Deploying Mashroom Portal on Kubernetes cluster ${CLUSTER}"

# Set auth on kubectl and docker
gcloud container clusters get-credentials "${CLUSTER}" --zone "${ZONE}"
gcloud auth configure-docker

# Service account
kubectl apply -f ./list-services-cluster-role.yaml
kubectl apply -f ./mashroom-portal-service-account.yaml
kubectl apply -f ./mashroom-portal-service-account-role-binding.yaml

# Persistent volume claim
kubectl apply -f ./pvc.yaml

# Portal
kubectl apply -f ./mashroom-portal-deployment.yaml
kubectl apply -f ./mashroom-portal-service.yaml
kubectl apply -f ./mashroom-portal-ingress.yaml
