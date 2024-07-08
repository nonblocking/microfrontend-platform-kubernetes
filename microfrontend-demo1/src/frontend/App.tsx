import React, {useState, useEffect} from "react";
import type {RandomJoke} from "../../type-definitions";

import * as styles from "./App.scss";
import fetchJoke from "./fetchJoke";

type Props = {
    restProxyPath: string;
};

export default ({restProxyPath}: Props) => {
    const [randomJoke, setRandomJoke] = useState<RandomJoke | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchJoke(restProxyPath).then(
            (joke: RandomJoke) => {
                setRandomJoke(joke);
            },
            (error) => {
                console.error(error);
                setError(true);
            },
        );
    }, []);

    let content;

    if (error) {
        content = <div className={styles.Error}>Error loading</div>;
    } else if (!randomJoke) {
        content = <div>Loading...</div>;
    } else {
        content = (
            <div>
                <h4>Random Chuck Norris Joke</h4>
                <div dangerouslySetInnerHTML={{__html: randomJoke.joke}}/>
            </div>
        );
    }

    return (
        <div className={styles.App}>
            {content}
        </div>
    );
}
