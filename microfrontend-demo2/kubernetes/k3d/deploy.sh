#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/../../../k3d/set-env.sh

echo "Deploying Microservice Demo2 on Kubernetes cluster ${CLUSTER}"

envsub $DIRECTORY/microservice-demo2-deployment_template.yaml $DIRECTORY/microservice-demo2-deployment.yaml

kubectl apply -f $DIRECTORY/microservice-demo2-deployment.yaml
kubectl apply -f $DIRECTORY/microservice-demo2-service.yaml

echo "Deployment finished"
