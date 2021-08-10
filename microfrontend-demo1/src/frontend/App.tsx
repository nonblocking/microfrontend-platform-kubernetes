
import React, { PureComponent } from 'react';
import type {MashroomRestService} from '@mashroom/mashroom-portal/type-definitions';
import type {RandomJoke} from '../../type-definitions';

import style from './App.scss';

type Props = {
    restProxyPath: string;
    restService: MashroomRestService;
}

type State = {
    joke: string | null;
    error: boolean;
}

class App extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            error: false,
            joke: null
        }
    }

    componentDidMount() {
        const { restService, restProxyPath } = this.props;

        restService.withBasePath(restProxyPath).get('/randomJoke').then(
            (randomJoke: RandomJoke) => {
                this.setState({
                    joke: randomJoke.joke,
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
        const { joke, error } = this.state;
        if (error) {
            return <div className={style.Error}>Error loading</div>
        } else if (!joke) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h4>Random Chuck Norris Joke</h4>
                <div dangerouslySetInnerHTML={{ __html: joke }}/>
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
