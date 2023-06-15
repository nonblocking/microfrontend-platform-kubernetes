
# Manual Setup Guide

This describes how to set up such a platform manually on an arbitrary Kubernetes cluster.

# Install common services

You need the following services installed or available on your cluster:

 * Redis
 * MongoDB
 * Keycloak

## Setup

### Keycloak

 * Create a new client in your realm (e.g. mashroom)
 * In the Settings tab set Access Type confidential
 * Make sure the Valid Redirect URIs contain the Portal URL
 * In the Credentials tab you'll find the client secret
 * To map the roles to a scope/claim goto Mappers, click Add Builtin and add a realm roles mapper. In the field Token Claim Name enter roles. Also check Add to ID token
 * You should create a role (e.g. *mashroom-admin*) for users with Administrator rights

## Alternatives

### Storage

  * Instead of MongoDB you could also use the *Mashroom Storage Filestore Provider* on production and just ship the storage (configuration) with the container
    (which makes it readonly on production)

### Messaging

 * If you don't need server-side messaging and don't want to use MongoDB for storage you don't need Redis either
 * Instead of Redis you could use ActiveMQ, RabbitMQ or Mosquitto for message brokering (every AMQP or MQTT compliant broker will work)

### Identity Provider

 * Instead of Keycloak you could use any other OpenID Connect compliant IDP
 * You could use LDAP/AD instead (*Mashroom LDAP Security Provider* plugin)

# Configure Mashroom Portal

Update *portal/config/production/mashroom.js* according to your setup.

## Storage

```javascript
{
    plugins: {
        'Mashroom Storage MongoDB Provider': {
            uri: process.env.MONGODB_CONNECTION_URL,
            connectionOptions: {
                minPoolSize: 5
            }
        }
    }
}
```

## Memory Cache

Optional, but recommended if you use *Mashroom Storage MongoDB Provider*

```javascript
{
    plugins: {
        'Mashroom Memory Cache Redis Provider': {
            redisOptions: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.OPTIONAL_REDIS_PASSWORD,
                keyPrefix: 'mashroom:cache:',
            },
        },
    }
}
```

## Messaging

```javascript
{
    plugins: {
        'Mashroom Messaging External Provider Redis': {
            internalTopic: "mashroom",
                client: {
                redisOptions: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                    password: process.env.OPTIONAL_REDIS_PASSWORD,
                    maxRetriesPerRequest: 3,
                    enableOfflineQueue: false
                }
            }
        }
    }
}
```

If you want to use an AMQP broker, check: https://github.com/nonblocking/mashroom/tree/master/packages/plugin-packages/mashroom-messaging-external-provider-amqp
If you want to use a MQTT broker, check: https://github.com/nonblocking/mashroom/tree/master/packages/plugin-packages/mashroom-messaging-external-provider-mqtt

## Identity Provider

```javascript
{
    plugins: {
        'Mashroom OpenID Connect Security Provider': {
            issuerDiscoveryUrl: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/.well-known/uma2-configuration`,
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            redirectUrl: `${process.env.PORTAL_URL}/openid-connect-cb`,
            rolesClaim: 'roles',
            adminRoles: [
                '<your admin role>'
            ]
        },
    }
}
```

For a different OIDC complaint IDP check: https://github.com/nonblocking/mashroom/tree/master/packages/plugin-packages/mashroom-security-provider-openid-connect
For authentication via LDAP/AD check: https://github.com/nonblocking/mashroom/tree/master/packages/plugin-packages/mashroom-security-provider-ldap

## Microfrontend scan

You have to set up a scan so Mashroom can find your Microfrontends (automatically). A typical setup would be:

```javascript
{
    plugins: {
        'Mashroom Portal Remote App Kubernetes Background Job': {
            refreshIntervalSec: 60,
            k8sNamespacesLabelSelector: ["environment=test,microfrontends=true"],
            k8sNamespaces: [],
            serviceNameFilter: 'microfrontend-.*'
        },
    }
}
```

Like this, Mashroom would pick up all services with name *microfrontend-xxx* in namespaces labeled with *environment=test* and *microfrontends=true*.

You might want to pass the target environment via variable and filter the microfrontend by label instead by name like this:

```javascript
{
    plugins: {
        'Mashroom Portal Remote App Kubernetes Background Job': {
            refreshIntervalSec: 60,
            k8sNamespacesLabelSelector: [`environment=${process.env.TARGET_ENVIRONMENT},microfrontends=true`],
            k8sServiceLabelSelector: ['microfrontend=true'],
            k8sNamespaces: [],
            serviceNameFilter: '.*'
        },
    }
}
```

**Important Note**: To be able to scan services and namespaces in the cluster you have to set up a service account with appropriate permissions
and assign it to the Portal pods (see below).

# Deploy Portal

# Set up a Service Account

Check out [this example](k3d/portal-service-account_template.yaml) which gives the Portal the permission to list all
namespaces and services in the whole cluster.

# Build and push the image

In *portal/* run:

    docker build -t <your-registry>/mashroom-portal:latest -t <your-registry>/mashroom-portal:<your-version> .
    docker push <your-registry>/mashroom-portal:latest
    docker push <your-registry>/mashroom-portal:<your-version>

# Deploy it on K8S

Check out the Deployment and Service templates in [portal/kubernetes/k3d](portal/kubernetes/k3d).

Don't forget to set a *serviceAccountName*!

# Deploy Microfrontends

# Build and push the image

In *microfrontend1/* run:

    docker build -t <your-registry>/microfrontend-demo1:latest -t <your-registry>/microfrontend-demo1:<your-version> .
    docker push <your-registry>/microfrontend-demo1:latest
    docker push <your-registry>/microfrontend-demo1:<your-version>

# Deploy it on K8S

Check out the Deployment and Service templates in [microfrontend-demo1/kubernetes/k3d](microfrontend-demo1/kubernetes/k3d).
