#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.s

source ./set-env.sh

echo "Deploying Redis..."
# Possible parameters: https://github.com/helm/charts/tree/master/stable/redis
helm install redis \
  --version "12.8.3" \
  --set usePassword=false \
    bitnami/redis

echo "Deploying RabbitMQ with AMQP 1.0 plugin..."
# Possible parameters: https://github.com/helm/charts/tree/master/stable/rabbitmq
helm install rabbitmq-amqp10 \
  --version "6.17.5" \
  --set replicas=2,rabbitmq.username=${RABBITMQ_USER},rabbitmq.password=${RABBITMQ_PASSWORD},rabbitmq.plugins="rabbitmq_management rabbitmq_peer_discovery_k8s rabbitmq_amqp1_0" \
    bitnami/rabbitmq

echo "Deploying MongoDB"
# Possible parameters: https://github.com/helm/charts/tree/master/stable/mongodb
helm install mongodb \
  --version "7.8.8" \
  --set replicaSet.enabled=true,mongodbDatabase=${MONGODB_DATABASE},mongodbUsername=${MONGODB_USER},mongodbPassword=${MONGODB_PASSWORD} \
    bitnami/mongodb

echo "Deploying MySQL"
# Possible parameters: https://github.com/helm/charts/tree/master/stable/mysql
helm install mysql \
  --version "1.6.9" \
  --set replicaSet.enabled=true,mysqlDatabase=${MYSQL_DATABASE},mysqlUser=${MYSQL_USER},mysqlPassword=${MYSQL_PASSWORD} \
    stable/mysql

echo "Deploying Keycloak"
envsub ${DIRECTORY}/../keycloak/k3d/values_template.yaml ${DIRECTORY}/../keycloak/k3d/values.yaml

# Possible parameters: https://github.com/codecentric/helm-charts/tree/master/charts/keycloak
helm install keycloak \
  --version "8.3.0" \
  -f ${DIRECTORY}/../keycloak/k3d/values.yaml \
  --set keycloak.persistence.dbName=${MYSQL_DATABASE},keycloak.persistence.dbUser=${MYSQL_USER},keycloak.persistence.dbPassword=${MYSQL_PASSWORD},\
keycloak.persistence.dbHost=mysql.default,keycloak.persistence.dbPort=3306,keycloak.username=${KEYCLOAK_ADMIN_USER},keycloak.password=${KEYCLOAK_ADMIN_PASSWORD} \
  codecentric/keycloak

echo "Successfully setup cluster!"

echo "Keycloak is available at http://keycloak-http:${NODE_PORT_KEYCLOAK}}"
