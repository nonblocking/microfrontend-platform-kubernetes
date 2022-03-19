#!/bin/bash

source ./set-env.sh

DIRECTORY=$(cd `dirname $0` && pwd)

echo "Creating configmap..."

envsub ${DIRECTORY}/configmap_template.yaml ${DIRECTORY}/configmap.yaml
kubectl apply -f ${DIRECTORY}/configmap.yaml

