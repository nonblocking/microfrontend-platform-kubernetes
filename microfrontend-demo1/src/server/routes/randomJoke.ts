import { Request, Response } from "express";
import fetch from "node-fetch";
import Pino from "pino";

import { JokeApiResponse, RandomJoke } from "../../../type-definitions";

const pino = Pino();

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await fetch("https://api.chucknorris.io/jokes/random");

        if (!result.ok) {
            pino.error('Received response code: %s', result.status);
            res.sendStatus(500);
            return;
        }

        const data: JokeApiResponse = await result.json();

        const randomJoke: RandomJoke = {
            joke: data.value,
        };
        res.json(randomJoke);
    } catch (e: unknown) {
        pino.error(
            e as Record<string, unknown>,
            "Looking up a random joke failed",
        );
        res.sendStatus(500);
    }
};
