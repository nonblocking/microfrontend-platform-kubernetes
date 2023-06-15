
export type RocketLaunchDotLiveResponse = {
    result: Array<RocketLaunchDotLiveLaunch>,
}

export type RocketLaunchDotLiveLaunch = {
    id: string;
    name: string;
    t0: string;
    provider: {
        name: string;
    };
    vehicle: {
        name: string;
    };
    pad: {
        name: string;
        location: {
            name: string;
        }
    };
    missions: Array<{
        name: string;
    }>;
}

export type NextLaunch = {
    provider: string;
    missionName: string;
    launchDate: number;
    rocketName: string;
    launchSite: string;
}
