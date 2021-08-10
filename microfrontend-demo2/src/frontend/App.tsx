
import React, { PureComponent } from 'react';

import type {MashroomRestService} from '@mashroom/mashroom-portal/type-definitions';
import type {NextLaunch} from '../../type-definitions';

import style from './App.scss';

type Props = {
    restProxyPath: string;
    restService: MashroomRestService;
}

type State = {
    nextLaunch: NextLaunch | null;
    error: boolean;
}

class App extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            error: false,
            nextLaunch: null
        }
    }

    componentDidMount() {
        const { restService, restProxyPath } = this.props;

        restService.withBasePath(restProxyPath).get('/nextLaunch').then(
            (nextLaunch: NextLaunch) => {
                this.setState({
                    nextLaunch,
                });
            },
            (error) => {
                console.error(error);
                this.setState({
                   error: true
                });
            }
        )
    }

    renderContent() {
        const { nextLaunch, error } = this.state;
        if (error) {
            return <div className={style.Error}>Error loading</div>
        } else if (!nextLaunch) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h4>Next SpaceX Launch</h4>
                <table>
                    <tbody>
                        <tr>
                            <th>Flight Number</th>
                            <td>{nextLaunch.flightNumber}</td>
                        </tr>
                        <tr>
                            <th>Mission Name</th>
                            <td>{nextLaunch.missionName}</td>
                        </tr>
                        <tr>
                            <th>Launch Date</th>
                            <td>{new Date(nextLaunch.launchDate * 1000).toLocaleString()}</td>
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

    render() {
        return (
            <div className={style.App}>
                {this.renderContent()}
            </div>
        );
    }
}

export default App;
