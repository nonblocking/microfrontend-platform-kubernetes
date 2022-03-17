#!/bin/bash

source ../../../k3d/set-env.sh

echo "Deploying Microservice Demo1 on Kubernetes cluster ${CLUSTER}"

envsub microservice-demo1-deployment_template.yaml microservice-demo1-deployment.yaml

kubectl apply -f ./microservice-demo1-deployment.yaml
kubectl apply -f ./microservice-demo1-service.yaml

echo "Deployment finished"
