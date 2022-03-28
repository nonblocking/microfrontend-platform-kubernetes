#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh


echo "Setting up portal service account..."

kubectl apply -f ${DIRECTORY}/portal-service-account.yaml

