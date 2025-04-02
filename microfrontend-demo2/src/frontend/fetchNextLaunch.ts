import type { NextLaunch } from '../../type-definitions';

export default (restProxyPath: string): Promise<NextLaunch> => {
    return fetch(`${restProxyPath}/nextLaunch`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Error: Received ${response.status}`);
        })
        .then((nextLaunch: NextLaunch) => nextLaunch);
};
