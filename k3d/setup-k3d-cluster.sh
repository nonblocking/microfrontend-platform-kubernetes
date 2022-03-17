#!/bin/bash

source ./set-env.sh

echo "Creating new cluster '${CLUSTER}'..."
k3d cluster create ${CLUSTER} --agents ${NUM_AGENTS} -p "${NODE_PORT_RANGE_FROM}-${NODE_PORT_RANGE_TO}:${NODE_PORT_RANGE_FROM}-${NODE_PORT_RANGE_TO}@agent:0" --registry-use k3d-${LOCAL_REGISTRY_NAME}:${LOCAL_REGISTRY_PORT}

kubectl config get-contexts
kubectl config use-context k3d-${CLUSTER}
