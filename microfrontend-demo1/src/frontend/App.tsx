import React, { PureComponent } from "react";
import type { MashroomRestService } from "@mashroom/mashroom-portal/type-definitions/internal";
import type { RandomJoke } from "../../type-definitions";

import style from "./App.scss";
import fetchJoke from "./fetchJoke";

type Props = {
    restProxyPath: string;
    restService: MashroomRestService;
};

type State = { randomJoke?: RandomJoke; error: boolean };

class App extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: false,
            randomJoke: undefined,
        };
    }

    componentDidMount() {
        const { restProxyPath } = this.props;

        fetchJoke(restProxyPath).then(
            (randomJoke: RandomJoke) => {
                this.setState({ ...{ randomJoke } });
            },
            (error) => {
                console.error(error);
                this.setState({
                    ...{
                        error: true,
                    },
                });
            },
        );
    }

    renderContent() {
        const { randomJoke, error } = this.state;
        if (error) {
            return <div className={style.Error}>Error loading</div>;
        } else if (!randomJoke) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h4>Random Chuck Norris Joke</h4>
                <div dangerouslySetInnerHTML={{ __html: randomJoke.joke }} />
            </div>
        );
    }

    render() {
        return <div className={style.App}>{this.renderContent()}</div>;
    }
}

export default App;
