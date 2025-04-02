import type { RandomJoke } from '../../type-definitions/index';

export default (restProxyPath: string): Promise<RandomJoke> => {
    return fetch(`${restProxyPath}/randomJoke`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Error: Received ${response.status}`);
        })
        .then((randomeJoke: RandomJoke) => randomeJoke);
};
