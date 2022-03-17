#!/bin/bash

source ./set-env.sh

echo "Creating configmap..."

envsub configmap_template.yaml configmap.yaml
kubectl apply -f ./configmap.yaml

