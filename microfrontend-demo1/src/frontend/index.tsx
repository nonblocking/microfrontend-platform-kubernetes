
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

import { MashroomPortalAppPluginBootstrapFunction } from '@mashroom/mashroom-portal/type-definitions';

const bootstrap: MashroomPortalAppPluginBootstrapFunction = (
    portalAppHostElement,
    portalAppSetup,
) => {
    const { restProxyPaths } = portalAppSetup || {};
    const restProxyPath = restProxyPaths.bff;

    const root = createRoot(portalAppHostElement);
    root.render(
        <App restProxyPath={restProxyPath}/>
    );

    return Promise.resolve({
        willBeRemoved: () => {
            root.unmount();
        },
    });
};

(window as any).startupMicrofrontendDemo1 = bootstrap;
