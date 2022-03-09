import { Request, Response } from "express";
import { get } from "request";
import { promisify } from "util";
import Pino from "pino";
import {
    NextLaunch,
    SpaceXApiLaunchPadResponse,
    SpaceXApiNextLaunchResponse,
    SpaceXApiRocketResponse,
} from "../../../type-definitions";

const pino = Pino();
const getAsync = promisify<string>(get) as (
    arg1: string,
) => Promise<unknown> as (
    arg1: string,
) => Promise<{ statusCode: number; body: any }>;

const isStatusCodeValid = (res: Response, statusCode: number): boolean => {
    if (statusCode !== 200) {
        res.sendStatus(500);
        return false;
    }
    return true;
};
export default async (req: Request, res: Response): Promise<void> => {
    try {
        const { statusCode, body: nextLaunchBody } = await getAsync(
            "https://api.spacexdata.com/v4/launches/next",
        );
        if (!isStatusCodeValid(res, statusCode)) {
            return;
        }

        const nextLaunchData: SpaceXApiNextLaunchResponse =
            JSON.parse(nextLaunchBody);

        const { statusCode: statusCode2, body: launchPadBody } = await getAsync(
            "https://api.spacexdata.com/v4/launchpads/" +
                nextLaunchData.launchpad,
        );
        if (!isStatusCodeValid(res, statusCode2)) {
            return;
        }

        const { statusCode: statusCode3, body: rocketBody } = await getAsync(
            "https://api.spacexdata.com/v4/rockets/" + nextLaunchData.rocket,
        );
        if (!isStatusCodeValid(res, statusCode3)) {
            return;
        }
        const launchPadData: SpaceXApiLaunchPadResponse =
            JSON.parse(launchPadBody);
        const rocketData: SpaceXApiRocketResponse = JSON.parse(rocketBody);

        const bffResp: NextLaunch = {
            flightNumber: nextLaunchData.flight_number,
            missionName: nextLaunchData.name,
            launchDate: nextLaunchData.date_unix,
            launchSite: launchPadData.full_name,
            rocketName: rocketData.name,
        };
        res.json(bffResp);
    } catch (e: unknown) {
        pino.error(
            e as Record<string, unknown>,
            "Looking up the next SpaceX flight failed",
        );
        res.sendStatus(500);
    }
};
