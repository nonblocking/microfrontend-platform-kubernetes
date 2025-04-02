
const {
    PORTAL_URL,
    KEYCLOAK_URL,
    KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET,
    MONGODB_CONNECTION_URI,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    SHOW_ENV_AND_VERSIONS,
} = process.env;

module.exports = {
    name: 'Microfrontend Platform Kubernetes',
    port: 5050,
    pluginPackageFolders: [
        {
            path: '../../node_modules/@mashroom',
        },
    ],
    ignorePlugins: [
        'Mashroom Security Simple Provider',
        'Mashroom Storage Filestore Provider',
    ],
    indexPage: '/portal',
    plugins: {
        'Mashroom Portal WebApp': {
            adminApp: 'Mashroom Portal Admin App',
            defaultTheme: 'Mashroom Portal Default Theme',
            authenticationExpiration: {
                warnBeforeExpirationSec: 120
            }
        },
        'Mashroom Portal Default Theme': {
            showEnvAndVersions: SHOW_ENV_AND_VERSIONS === 'true' || SHOW_ENV_AND_VERSIONS === true,
            showPortalAppHeaders: false,
            darkMode: 'auto'
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
            client: {
                redisOptions: {
                    host: REDIS_HOST,
                    port: REDIS_PORT,
                    password: REDIS_PASSWORD,
                }
            },
            prefix: 'mashroom:sess:',
        },
        'Mashroom Security Services': {
            provider: 'Mashroom OpenID Connect Security Provider',
            acl: './acl.json'
        },
        'Mashroom OpenID Connect Security Provider': {
            issuerDiscoveryUrl: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/.well-known/uma2-configuration`,
            clientId: KEYCLOAK_CLIENT_ID,
            clientSecret: KEYCLOAK_CLIENT_SECRET,
            redirectUrl: `${PORTAL_URL}/openid-connect-cb`,
            rolesClaim: 'roles',
            adminRoles: [
                'mashroom-admin'
            ]
        },
        'Mashroom Security Default Login Webapp': {
            darkMode: 'auto'
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
                minPoolSize: 5,
            }
        },
        'Mashroom Memory Cache Services': {
            provider: 'Mashroom Memory Cache Redis Provider',
        },
        'Mashroom Memory Cache Redis Provider': {
            redisOptions: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                password: REDIS_PASSWORD,
                keyPrefix: 'mashroom:cache:',
            },
        },
        'Mashroom Internationalization Services': {
            availableLanguages: ['en', 'de'],
            defaultLanguage: 'en'
        },
        'Mashroom Http Proxy Services': {
            rejectUnauthorized: false,
            poolMaxSocketsPerHost: 10
        },
        'Mashroom WebSocket Webapp': {
            restrictToRoles: null,
            enableKeepAlive: true,
            keepAliveIntervalSec: 15,
            maxConnections: 2000
        },
        'Mashroom Portal Remote App Kubernetes Background Job': {
            refreshIntervalSec: 60,
            k8sNamespacesLabelSelector: ['environment=test,microfrontends=true'],
            k8sNamespaces: [],
            serviceNameFilter: 'microfrontend-.*'
        },
        'Mashroom Messaging Services': {
            externalProvider: 'Mashroom Messaging External Provider Redis',
            externalTopics: [],
            userPrivateBaseTopic: 'user',
            enableWebSockets: true,
            topicACL: './topicACL.json'
        },
        'Mashroom Messaging External Provider Redis': {
            internalTopic: 'mashroom',
            client: {
                redisOptions: {
                    host: REDIS_HOST,
                    port: REDIS_PORT,
                    password: REDIS_PASSWORD,
                    maxRetriesPerRequest: 3,
                    enableOfflineQueue: false
                }
            }
        }
    }
};

