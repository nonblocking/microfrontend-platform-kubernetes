import fetch from 'node-fetch';
import Pino from 'pino';
import type { Request, Response } from 'express';
import type {NextLaunch, RocketLaunchDotLiveResponse} from '../../../type-definitions';

const pino = Pino();

export default async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await fetch('https://fdo.rocketlaunch.live/json/launches/next/5');

        if (!result.ok) {
            pino.error('Received response code: %s', result.status);
            res.sendStatus(500);
            return;
        }

        const launchData: RocketLaunchDotLiveResponse = await result.json();
        const nextLaunchData = launchData.result[0];

        const bffResp: NextLaunch = {
            missionName: nextLaunchData.name,
            provider: nextLaunchData.provider.name,
            launchDate: new Date(nextLaunchData.t0).getTime(),
            launchSite: nextLaunchData.pad.location.name,
            rocketName: nextLaunchData.vehicle.name,
        };
        res.json(bffResp);
    } catch (e: unknown) {
        pino.error(
            e as Record<string, unknown>,
            'Looking up the next SpaceX flight failed',
        );
        res.sendStatus(500);
    }
};
