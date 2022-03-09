import { Request, Response } from "express";
import { get } from "request";
import { promisify } from "util";
import Pino from "pino";

import { JokeApiResponse, RandomJoke } from "../../../type-definitions";

const pino = Pino();
const getAsync = promisify<string>(get) as (
    arg1: string,
) => Promise<unknown> as (
    arg1: string,
) => Promise<{ statusCode: number; body: any }>;

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const { statusCode, body } = await getAsync(
            "http://api.icndb.com/jokes/random",
        );
        const data: JokeApiResponse = JSON.parse(body);

        if (statusCode === 200 && data.type === "success") {
            const randomJoke: RandomJoke = {
                joke: data.value.joke,
            };
            res.json(randomJoke);
        } else {
            res.sendStatus(500);
        }
    } catch (e: unknown) {
        pino.error(
            e as Record<string, unknown>,
            "Looking up a random joke failed",
        );
        res.sendStatus(500);
    }
};
