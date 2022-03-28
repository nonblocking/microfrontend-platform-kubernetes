#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh

echo "Creating configmap..."

envsub ${DIRECTORY}/configmap_template.yaml ${DIRECTORY}/configmap.yaml
kubectl apply -f ${DIRECTORY}/configmap.yaml

