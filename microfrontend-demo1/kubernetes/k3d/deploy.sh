#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/../../../k3d/set-env.sh

echo "Deploying Microservice Demo1 on Kubernetes cluster ${CLUSTER}"

envsub $DIRECTORY/microservice-demo1-deployment_template.yaml $DIRECTORY/microservice-demo1-deployment.yaml

kubectl apply -f $DIRECTORY/microservice-demo1-deployment.yaml
kubectl apply -f $DIRECTORY/microservice-demo1-service.yaml

echo "Deployment finished"
