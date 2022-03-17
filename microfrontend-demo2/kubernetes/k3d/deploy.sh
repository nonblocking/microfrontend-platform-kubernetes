#!/bin/bash

source ../../../k3d/set-env.sh

echo "Deploying Microservice Demo2 on Kubernetes cluster ${CLUSTER}"

envsub microservice-demo2-deployment_template.yaml microservice-demo2-deployment.yaml

kubectl apply -f ./microservice-demo2-deployment.yaml
kubectl apply -f ./microservice-demo2-service.yaml

echo "Deployment finished"
