#!/bin/bash

source ./set-env.sh

echo "Setting up portal service account..."

kubectl apply -f ./portal-service-account.yaml

