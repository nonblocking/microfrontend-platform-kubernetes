
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

import { MashroomPortalAppPluginBootstrapFunction } from '@mashroom/mashroom-portal/type-definitions';

const bootstrap: MashroomPortalAppPluginBootstrapFunction = (
    portalAppHostElement,
    portalAppSetup,
    clientServices,
) => {
    const { restProxyPaths } = portalAppSetup || {};
    const { restService } = clientServices;
    const restProxyPath = restProxyPaths.bff;

    const root = createRoot(portalAppHostElement);
    root.render(
        <App restService={restService} restProxyPath={restProxyPath}/>
    );

    return Promise.resolve({
        willBeRemoved: () => {
            root.unmount();
        },
    });
};

// @ts-ignore
window.startupMicrofrontendDemo1 = bootstrap;
