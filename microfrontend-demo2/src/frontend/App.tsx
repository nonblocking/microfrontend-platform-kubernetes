import React, {useEffect, useState} from "react";
import fetchNextLaunch from "./fetchNextLaunch";
import type {NextLaunch} from "../../type-definitions";

import * as styles from "./App.scss";

type Props = {
    restProxyPath: string;
};

export default ({restProxyPath}: Props) => {
    const [nextLaunch, setNextLaunch] = useState<NextLaunch | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchNextLaunch(restProxyPath).then(
            (launch) => {
                setNextLaunch(launch);
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
    } else if (!nextLaunch) {
        content = <div>Loading...</div>;
    } else {
        content = (
            <div>
                <h4>Next Rocket Launch</h4>
                <table>
                    <tbody>
                    <tr>
                        <th>Provider</th>
                        <td>{nextLaunch.provider}</td>
                    </tr>
                    <tr>
                        <th>Mission Name</th>
                        <td>{nextLaunch.missionName}</td>
                    </tr>
                    <tr>
                        <th>Launch Date</th>
                        <td>
                            {new Date(nextLaunch.launchDate).toLocaleString()}
                        </td>
                    </tr>
                    <tr>
                        <th>Rocket Name</th>
                        <td>{nextLaunch.rocketName}</td>
                    </tr>
                    <tr>
                        <th>Launch Site</th>
                        <td>{nextLaunch.launchSite}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={styles.App}>
            {content}
        </div>
    )
}

