# Setup on K3D

This describes how to setup such a platform with [k3d](https://k3d.io) for local testing and development.

If you use the _Google Kubernetes Engine_ use the [GCP Setup Guide](SETUP_GCP.md) which is much simpler.

If you use any other technology to run a k8s cluster please follow the [Setup K8S manually Guide](SETUP_K8S_MANUAL.md).

## Requirements

### Installed

-   [docker](https://www.docker.com)
-   [k3d](https://k3d.io)
-   [kubectl](https://kubernetes.io/de/docs/tasks/tools/install-kubectl/)
-   [helm](https://helm.sh/)
-   [envsub](https://github.com/danday74/envsub)

## Quickstart (only for mac and linux)

-   [Setup helm](#setup-helm): `./k3d/setup-helm.sh`
-   [Create a local registry](#create-a-local-registry): `sudo --preserve-env ./k3d/setup-registry.sh`
-   [Forward keycloak-http to localhost](#forward-keycloak-http-to-localhost): `sudo ./k3d/setup-keycloak-localhost-forward.sh`
-   [Create a k3d cluster](#create-a-k3d-cluster): `./k3d/setup-k3d-cluster.sh`
-   [Setup common services](#setup-common-services): `./k3d/setup-common-services.sh`
-   Wait until all common services are running: `kubectl get pods`
-   Setup keycloak: Go to [Setup a keycloak realm](#setup-a-keycloak-realm)
-   Do not forget to copy the client secret to `./k3d/set-env.sh`
-   `source ./k3d/set-env.sh`
-   [Create a ConfigMap for the common services](#create-a-configmap-for-the-common-services): `./k3d/setup-configmap.sh`
-   [Create a service account](#create-a-service-account): `./k3d/setup-portal-service-account.sh`
-   [Create portal docker image](#create-portal-docker-image): `./portal/kubernetes/k3d/docker-build-and-push.sh`
-   [Deploy portal on Kubernetes](#deploy-portalon-kubernetes): `./portal/kubernetes/k3d/deploy.sh`
-   [Create docker image of microfrontend-demo1](#create-microfontends-docker-images): `./microfrontend-demo1/kubernetes/k3d/docker-build-and-push-portal.sh`
-   [Deploy microfrontend-demo1](#deploy-microfrontends-on-kubernetes): `./microfrontend-demo1/kubernetes/k3d/deploy.sh`
-   [Create docker image of microfrontend-demo2](#create-microfontends-docker-images): `./microfrontend-demo2/kubernetes/k3d/docker-build-and-push.sh`
-   [Deploy microfrontend-demo2](#deploy-microfrontends-on-kubernetes): `./microfrontend-demo2/kubernetes/k3d/deploy.sh`
-   Enjoy your [portal](http://localhost:30082)
-   [Cleanup](#cleanup)
-   [Troubleshooting](#troubleshooting)

## Setup helm

And add at least the following Helm repos:

    ./k3d/setup-helm.sh

_Or_

    helm repo add stable https://charts.helm.sh/stable
    helm repo add codecentric https://codecentric.github.io/helm-charts
    helm repo add bitnami https://charts.bitnami.com/bitnami

## Create a local registry

    sudo ./k3d/setup-registry.sh

_Or_

    k3d registry create <LOCAL_REGISTRY_NAME> --port <LOCAL_REGISTRY_PORT>
    Add `127.0.0.1 k3d-<LOCAL_REGISTRY_NAME>` to `/etc/hosts` (windows: `C:\Windows\System32\drivers\etc\hosts`)

## Forward keycloak-http to localhost

This step is necessary to avoid having trouble accessing keycloak from within the cluster.

    sudo ./k3d/setup-keycloak-localhost-forward

_Or_

    Add `127.0.0.1 keycloak-http` to `/etc/hosts` (windows: `C:\Windows\System32\drivers\etc\hosts`)

## Create a k3d cluster

    ./k3d/setup-k3d-cluster.sh

_Or_

    k3d cluster create <CLUSTER_NAME> --agents <NUM_AGENTS> -p "<NODE_PORT_RANGE_FROM>-<NODE_PORT_RANGE_TO>:<NODE_PORT_RANGE_FROM>-<NODE_PORT_RANGE_TO>@agent:0" --registry-use     k3d-<LOCAL_REGISTRY_NAME>:<LOCAL_REGISTRY_PORT>

_Make sure kubectl uses the right context_

    kubectl config get-contexts
    kubectl config use-context k3d-<CLUSTER_NAME>

## Check K8s

Run `kubectl cluster-info`

The output should look similar to this:

```
Kubernetes master is running at https://localhost:55000
CoreDNS is running at https://localhost:55000/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://localhost:55000/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

## Setup common services

    ./k3d/setup-common-services.sh

_Or install Redis, RabbitMQ, MongoDB, MySQL, Keycloak manually_

### Redis

    helm install redis --version "12.8.3" --set auth.enabled=false bitnami/redis

### RabbitMQ

    helm install rabbitmq-amqp10 \
      --version "6.17.5" \
      --set replicas=2,rabbitmq.username=<username>,rabbitmq.password=<password>,rabbitmq.plugins="rabbitmq_management rabbitmq_peer_discovery_k8s rabbitmq_amqp1_0" \
      bitnami/rabbitmq

### MongoDB

    helm install mongodb \
      --version "7.8.8" \
      --set replicaSet.enabled=true,mongodbDatabase=<portal_db_name>,mongodbUsername=<portal_db_user>,mongodbPassword=<portal_db_password**> \
      bitnami/mongodb

### MySQL

    helm install mysql \
      --version "1.6.9" \
      --set replicaSet.enabled=true,mysqlDatabase=<keycloak_db_name>,mysqlUser=<keycloak_db_user>,mysqlPassword=<keycloak_db_password> \
        stable/mysql

### Keycloak

    Fill out the ./keycloak/k3d/values.yaml file and run

    helm install keycloak \
      --version "8.3.0" \
      -f ./keycloak/k3d/values.yaml \
      --set keycloak.persistence.dbName=<keycloak_db_name>,keycloak.persistence.dbUser=<keycloak_db_user>,keycloak.persistence.dbPassword=<keycloak_db_password>,\
    keycloak.persistence.dbHost=mysql.default,keycloak.persistence.dbPort=3306,keycloak.username=<keycloak_admin_user>,keycloak.password=<keycloak_admin_password> \
      codecentric/keycloak

#### Check if keycloak is ready

    kubectl get pods

    Output should be like:
    keycloak-0               1/1     Running   0          2m24s
    keycloak-1               1/1     Running   0          2m24s

Go to http://localhost:30081/

### Setup a keycloak realm

-   Open [keycloak](http://localhost:30081/)
-   Login to Keycloak (default admin/test) and setup a new Realm called `Mashroom` and a OpenID connect client called `mashroom-portal`
-   For this development environments you have to use a wildcard \* , however never ever do it in production.
-   In the _Settings_ tab set Access Type _confidential_
-   In the _Credentials_ tab you'll find the client secret -> **copy it to `./k3d/set-env.sh` or export/set an env varaible called _KEYCLOAK_CLIENT_SECRET_**
-   To map the roles to a scope/claim goto _Mappers_, click _Add Builtin_ and add a _realm roles_ mapper.
    In the field _Token Claim Name_ enter _roles_. Also check _Add to ID token_.
-   Add a role _mashroom-admin_
-   Go to [users](http://localhost:30081/auth/admin/master/console/#/realms/Mashroom/users) and add an admin user. Under _credentials_ set a default password. Under _role mappings_ add the role _mashroom-admin_ to this user
-   Go to [users](http://localhost:30081/auth/admin/master/console/#/realms/Mashroom/users) and add a user called john. Under _credentials_ set a default password. Do not add the _mashroom-admin_ role to this user!

### Create a ConfigMap for the common services

    ./k3d/setup-configmap.sh

_Or fill out and run_

```yaml
echo "apiVersion: v1
kind: ConfigMap
metadata:
    name: platform-services
    namespace: default
data:
    REDIS_HOST: redis-master.default
    REDIS_PORT: "6379"
    RABBITMQ_HOST: rabbitmq-amqp10.default
    RABBITMQ_PORT: "5672"
    RABBITMQ_USER: $RABBITMQ_USER
    MONGODB_CONNECTION_URI: mongodb://<portal_db_user>:<portal_db_password>@mongodb-primary-0.mongodb-headless.default:27017,mongodb-secondary-0.mongodb-headless.default:27017/<portal_db_name>?replicaSet=rs0
    KEYCLOAK_URL: http://keycloak-http:<NODE_PORT_KEYCLOAK>
```

## Deploy the Mashroom Portal

### Create a service account

It must have the permission to fetch all services for the namespace with the Microfrontends.

    ./k3d/setup-portal-service-account.sh

_Or_

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
    name: mashroom-portal
    namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
    name: list-services-cluster-role
rules:
    - apiGroups:
          - ""
      resources:
          - services
      verbs:
          - get
          - list
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
    name: mashroom-portal-role-binding
    namespace: default
subjects:
    - kind: ServiceAccount
      name: mashroom-portal
roleRef:
    kind: ClusterRole
    name: list-services-cluster-role
    apiGroup: rbac.authorization.k8s.io
```

### Create portal docker image

    ./portal/kubernetes/k3d/docker-build-and-push-portal.sh

_Or_

    cd portal
    npm install
    docker build -t mashroom-portal:latest .
    docker tag mashroom-portal:latest k3d-<LOCAL_REGISTRY_NAME>:<LOCAL_REGISTRY_PORT>/mashroom-portal:latest
    docker push k3d-<LOCAL_REGISTRY_NAME>:<LOCAL_REGISTRY_PORT>/mashroom-portal:latest
    cd ..

### Deploy portal on Kubernetes

    ./portal/kubernetes/k3d/deploy.sh

_Or manually adapt the template with the necessry envs and apply them_

    kubectl apply -f portal/kubernetes/list-services-cluster-role.yaml
    kubectl apply -f portal/kubernetes/mashroom-portal-service-account.yaml
    kubectl apply -f portal/kubernetes/mashroom-portal-service-account-role-binding.yaml
    kubectl apply -f portal/kubernetes/k3d/mashroom-portal-deployment_template.yaml
    kubectl apply -f portal/kubernetes/k3d/mashroom-portal-service_template.yaml

### Check if the portal is running

    kubectl get pods

    Outcome should be similar to:
    ```
    mashroom-portal-5cdfd9bc5b-8t672   1/1     Running   0          97s
    ```

    You can check the logs by running:

    kubectl logs mashroom-portal-5cdfd9bc5b-8t672

## Deploy the Microfrontends

To deploy microfrontend-demo1 (microfrontend-demo2) can be deployed similar:

### Create microfontends docker images

    ./microfrontend-demo1/kubernetes/k3d/docker-build-and-push-portal.sh
    ./microfrontend-demo2/kubernetes/k3d/docker-build-and-push-portal.sh

_Or_

    cd microfrontend-demo1
    npm i
    npm run build
    docker build -t nonblocking/microfrontend-demo1:latest .
    docker tag nonblocking/microfrontend-demo1:latest k3d-mashroomregistry.localhost:12345/nonblocking/microfrontend-demo1:latest
    docker push k3d-mashroomregistry.localhost:12345/nonblocking/microfrontend-demo1:latest
    cd ..

    cd microfrontend-demo2
    npm i
    npm run build
    docker build -t nonblocking/microfrontend-demo2:latest .
    docker tag nonblocking/microfrontend-demo2:latest k3d-mashroomregistry.localhost:12345/nonblocking/microfrontend-demo2:latest
    docker push k3d-mashroomregistry.localhost:12345/nonblocking/microfrontend-demo2:latest
    cd ..

### Deploy microfrontends on Kubernetes:

    ./microfrontend-demo1/kubernetes/k3d/deploy.sh
    ./microfrontend-demo2/kubernetes/k3d/deploy.sh

_Or manually adapt the template with the necessry envs and apply them_

`kubectl apply -f microfrontend-demo1/kubernetes/k3d/microservice-demo1-deployment_k3d.yaml`

`kubectl apply -f microfrontend-demo1/kubernetes/k3d/microservice-demo1-service.yaml`

`kubectl apply -f microfrontend-demo2/kubernetes/k3d/microservice-demo2-deployment_k3d.yaml`

`kubectl apply -f microfrontend-demo2/kubernetes/k3d/microservice-demo2-service.yaml`

## Check if the platform is up and running

-   Enter https://localhost:30082 in your browser
-   Login as admin user
-   On an arbitrary page click _Add App_, search for _Microfrontend Demo1_ and add via Drag'n'Drop:
    ![Microfrontends](./images/microfrontends.png)
-   You can check the registered Microfrontends on http://localhost:30082/portal-remote-app-registry-kubernetes
    ![Kubernetes Services](./images/registered_k8s_services.png)
-   To check the messaging add the _Mashroom Portal Demo Remote Messaging App_ (as admin) to a page,
    open the same page as another user (john/john) and send as _john_ a message to _user/admin/test_ -
    it should appear in the other users _Demo Remote Messaging App_
-   You can also check if all portal replicas are subscribed to the message broker. The RabbitMQ Admin UI can
    be made locally available with:

         kubectl port-forward --namespace default svc/rabbitmq-amqp10 15672:15672

    After opening http://localhost:15672 and logging in you should be able to see the bindings on the _amqp.topic_ exchange:
    ![The platform](./images/rabbitmq_bindings.png)

-   The Prometheus metrics will be available on http://localhost:30082/metrics. If you open this URL you should see something like this:
    ![Prometheus Metrics](./images/prometheus_metrics.png)

## Cleanup

    k3d cluster stop mashroom-cluster
    k3d cluster delete mashroom-cluster

## Troubleshooting

### Redeploy the mashroom portal

    kubectl rollout restart deployment mashroom-portal

    If you changed somthing in your yaml file, do not forget to apply it first:

    kubectl apply -f <pathToYourFile>.yaml

### Scripts cannot be executed

    You might forgot to give your script the permission to run
    chmod a+x <path to sciript>
