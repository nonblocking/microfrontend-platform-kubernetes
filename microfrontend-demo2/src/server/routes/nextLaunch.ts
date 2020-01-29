// @flow

import { Request, Response } from 'express';
import { get } from "request";
import { promisify } from "util";
import Pino from 'pino';
import {NextLaunch, SpaceXApiNextLaunchResponse} from '../../../type-definitions';

const pino = Pino();
const getAsync = promisify(get);

export default async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {statusCode, body} = await getAsync('https://api.spacexdata.com/v3/launches/next');
        const data: SpaceXApiNextLaunchResponse = JSON.parse(body);

        if (statusCode === 200) {
            const bffResp: NextLaunch = {
                flightNumber: data.flight_number,
                missionName: data.mission_name,
                launchDate: data.launch_date_unix,
                rocketName: data.rocket.rocket_name,
                launchSite: data.launch_site.site_name_long,
            };

            res.json(bffResp);
        } else {
            res.sendStatus(500);
        }

    } catch (e) {
        pino.error(e, 'Looking up a random joke failed');
        res.sendStatus(500);
    }
};
