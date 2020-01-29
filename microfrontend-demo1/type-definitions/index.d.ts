
export type JokeApiResponse = {
    type: string,
    value: {
        id: number,
        joke: string,
    }
}

export type RandomJoke = {
    joke: string
}
