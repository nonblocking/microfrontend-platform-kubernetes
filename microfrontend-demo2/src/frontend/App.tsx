
import React, { PureComponent } from 'react';
import { AppStyle, ErrorStyle } from './App.scss';

import { MashroomRestService } from '@mashroom/mashroom-portal/type-definitions';
import {NextLaunch} from '../../type-definitions';

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
            return <div className={ErrorStyle}>Error loading</div>
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
            <div className={AppStyle}>
                {this.renderContent()}
            </div>
        );
    }
}

export default App;
