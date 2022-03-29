#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh

echo "Uninstall Redis..."
helm uninstall redis 

echo "Uninstall RabbitMQ..."
helm uninstall rabbitmq-amqp10

echo "Uninstall MongoDB"
helm uninstall mongodb 

echo "Uninstall MySQL"
helm uninstall mysql 

helm uninstall keycloak 

echo "Successfully uninstalled common services!"

