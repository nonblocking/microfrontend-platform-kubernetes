#!/bin/bash

source ../../set-env.sh

echo "Deploying Microservice Demo2 on Kubernetes cluster ${CLUSTER}"

kubectl apply -f ./microservice-demo2-deployment.yaml
kubectl apply -f ./microservice-demo2-service.yaml
