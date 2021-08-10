
import { Request, Response } from 'express';
import { get } from "request";
import { promisify } from "util";
import Pino from 'pino';
import {
    NextLaunch,
    SpaceXApiLaunchPadResponse,
    SpaceXApiNextLaunchResponse,
    SpaceXApiRocketResponse
} from '../../../type-definitions';

const pino = Pino();
const getAsync = promisify(get);

export default async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {statusCode, body: nextLaunchBody} = await getAsync('https://api.spacexdata.com/v4/launches/next');
        if (statusCode !== 200) {
            res.sendStatus(500);
            return;
        }
        const nextLaunchData: SpaceXApiNextLaunchResponse = JSON.parse(nextLaunchBody);

        // @ts-ignore
        const {statusCode: statusCode2, body: launchPadBody} = await getAsync('https://api.spacexdata.com/v4/launchpads/' + nextLaunchData.launchpad);
        if (statusCode2 !== 200) {
            res.sendStatus(500);
            return;
        }
        // @ts-ignore
        const {statusCode: statusCode3, body: rocketBody} = await getAsync('https://api.spacexdata.com/v4/rockets/' + nextLaunchData.rocket);
        if (statusCode3 !== 200) {
            res.sendStatus(500);
            return;
        }
        const launchPadData: SpaceXApiLaunchPadResponse = JSON.parse(launchPadBody);
        const rocketData: SpaceXApiRocketResponse = JSON.parse(rocketBody);

        if (statusCode === 200) {
            const bffResp: NextLaunch = {
                flightNumber: nextLaunchData.flight_number,
                missionName: nextLaunchData.name,
                launchDate: nextLaunchData.date_unix,
                launchSite: launchPadData.full_name,
                rocketName: rocketData.name,
            };

            res.json(bffResp);
        } else {
            res.sendStatus(500);
        }

    } catch (e) {
        pino.error(e, 'Looking up the next SpaceX flight failed');
        res.sendStatus(500);
    }
};
