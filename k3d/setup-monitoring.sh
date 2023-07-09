#!/bin/bash

MONITORING_NAMESPACE="monitoring"
DIRECTORY=$(cd `dirname $0` && pwd)

source $DIRECTORY/set-env.sh

echo "Deploying Prometheus Operator"

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
    name: ${MONITORING_NAMESPACE}
EOF

kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: grafana-admin-user
  namespace: ${MONITORING_NAMESPACE}
type: Opaque
stringData:
  admin-user: test
  admin-password: test
EOF

# Possible parameters: https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack
helm install prometheus \
  --version "47.2.0" \
  --namespace "${MONITORING_NAMESPACE}" \
  --set grafana.sidecar.notifiers.enabled=true,grafana.service.type=NodePort,grafana.service.nodePort=${NODE_PORT_GRAFANA},grafana.admin.existingSecret=grafana-admin-user \
  prometheus-community/kube-prometheus-stack

echo "Add a ServiceMonitor for Mashroom Portal"

kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: mashroom-portal
  namespace: ${MONITORING_NAMESPACE}
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: mashroom-portal
  namespaceSelector:
    matchNames:
    - ${COMMON_NAMESPACE}
  endpoints:
  - targetPort: 5050
EOF

echo "Adding Mashroom Portal dashboard"

kubectl create configmap mashroom-portal-dashboard --namespace ${MONITORING_NAMESPACE} --from-file=${DIRECTORY}/mashroom-grafana-dashboard.json
kubectl label configmaps mashroom-portal-dashboard --namespace ${MONITORING_NAMESPACE} grafana_dashboard=1

echo "Grafana will be available at http://localhost:30083 with admin credentials test/test"
