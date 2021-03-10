
const {
    PORTAL_URL,
    KEYCLOAK_URL,
    KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET,
    MONGODB_CONNECTION_URI,
    REDIS_HOST,
    REDIS_PORT,
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_USER,
    RABBITMQ_PASSWORD,
    SHOW_ENV_AND_VERSIONS,
} = process.env;

module.exports = {
    name: 'Mashroom Portal Quickstart',
    port: 5050,
    pluginPackageFolders: [
        {
            'path': '../../node_modules/@mashroom',
        },
    ],
    ignorePlugins: [
        "Mashroom Security Simple Provider",
        "Mashroom Storage Filestore Provider",
        "Mashroom Portal Remote App Registry",
        "Mashroom Portal Remote App Registry Webapp"
    ],
    indexPage: '/portal',
    plugins: {
        'Mashroom Portal WebApp': {
            adminApp: 'Mashroom Portal Admin App',
            defaultTheme: 'Mashroom Portal Default Theme',
            warnBeforeAuthenticationExpiresSec: 120
        },
        "Mashroom Portal Default Theme": {
            showEnvAndVersions: SHOW_ENV_AND_VERSIONS === "true" || SHOW_ENV_AND_VERSIONS === true,
        },
        'Mashroom Session Middleware': {
            provider: 'Mashroom Session Redis Provider',
            session: {
                cookie: {
                    maxAge: 3600000
                }
            }
        },
        'Mashroom Session Redis Provider': {
            redisOptions: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                keyPrefix: 'mashroom:sess:',
            },
        },
        'Mashroom Security Services': {
            provider: 'Mashroom OpenID Connect Security Provider',
            acl: './acl.json'
        },
        'Mashroom OpenID Connect Security Provider': {
            "issuerDiscoveryUrl": `${KEYCLOAK_URL}/auth/realms/${KEYCLOAK_REALM}/.well-known/uma2-configuration`,
            "clientId": KEYCLOAK_CLIENT_ID,
            "clientSecret": KEYCLOAK_CLIENT_SECRET,
            "redirectUrl": `${PORTAL_URL}/openid-connect-cb`,
            "rolesClaim": "roles",
            "adminRoles": [
                "mashroom-admin"
            ]
        },
        'Mashroom Helmet Middleware': {

        },
        'Mashroom Storage Services': {
            provider: 'Mashroom Storage MongoDB Provider',
            memoryCache: {
                enabled: true,
                ttlSec: 120,
                invalidateOnUpdate: true,
            }
        },
        'Mashroom Storage MongoDB Provider': {
            uri: MONGODB_CONNECTION_URI,
            connectionOptions: {
                poolSize: 5,
            }
        },
        "Mashroom Memory Cache Services": {
            provider: 'Mashroom Memory Cache Redis Provider',
        },
        "Mashroom Memory Cache Redis Provider": {
            redisOptions: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                keyPrefix: 'mashroom:cache:',
            },
        },
        'Mashroom Internationalization Services': {
            availableLanguages: ['en', 'de'],
            defaultLanguage: 'en'
        },
        'Mashroom Http Proxy Services': {
            rejectUntrustedCerts: false,
            poolMaxSockets: 10
        },
        'Mashroom WebSocket Webapp': {
            restrictToRoles: null,
            enableKeepAlive: true,
            keepAliveIntervalSec: 15,
            maxConnections: 2000
        },
        'Mashroom Messaging Services': {
            externalProvider: 'Mashroom Messaging External Provider AMQP',
            externalTopics: [],
            userPrivateBaseTopic: 'user',
            enableWebSockets: true,
            topicACL: './topic_acl.json'
        },
        'Mashroom Portal Remote App Kubernetes Background Job': {
            k8sNamespaces: ['default'],
            serviceNameFilter: 'microfrontend-.*'
        },
        'Mashroom Messaging External Provider AMQP': {
            brokerTopicExchangePrefix: '/topic/',
            brokerTopicMatchAny: '#',
            brokerHost: RABBITMQ_HOST,
            brokerPort: RABBITMQ_PORT,
            brokerUsername: RABBITMQ_USER,
            brokerPassword: RABBITMQ_PASSWORD
        }
    }
};

