
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { MashroomPortalAppPluginBootstrapFunction } from '@mashroom/mashroom-portal/type-definitions';

const bootstrap: MashroomPortalAppPluginBootstrapFunction = (
    portalAppHostElement,
    portalAppSetup,
    clientServices,
) => {
    const { restProxyPaths = {} } = portalAppSetup || {};
    const { restService } = clientServices;
    const restProxyPath = restProxyPaths.bff;

    ReactDOM.render(
        <App restService={restService} restProxyPath={restProxyPath}/>,
        portalAppHostElement,
    );

    return Promise.resolve({
        willBeRemoved: () => {
            ReactDOM.unmountComponentAtNode(portalAppHostElement);
        },
    });
};

// @ts-ignore
window.startupMicrofrontendDemo2 = bootstrap;
