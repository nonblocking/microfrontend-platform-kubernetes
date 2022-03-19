#!/bin/bash

source ./set-env.sh

DIRECTORY=$(cd `dirname $0` && pwd)

echo "Setting up portal service account..."

kubectl apply -f ${DIRECTORY}/portal-service-account.yaml

