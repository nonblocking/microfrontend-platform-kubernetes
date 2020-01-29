#!/bin/bash

source ../../set-env.sh

echo "Deploying Microservice Demo1 on Kubernetes cluster ${CLUSTER}"

kubectl apply -f ./microservice-demo1-deployment.yaml
kubectl apply -f ./microservice-demo1-service.yaml
