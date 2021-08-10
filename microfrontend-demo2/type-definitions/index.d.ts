
export type SpaceXApiNextLaunchResponse = {
    flight_number: number,
    name: string,
    date_unix: number,
    date_utc: string,
    rocket: string;
    launchpad: string;
}

export type SpaceXApiLaunchPadResponse = {
    name: string;
    full_name: string,
}
export type SpaceXApiRocketResponse = {
    name: string;
    stages: number;
    boosters: number;
}

export type NextLaunch = {
    flightNumber: number,
    missionName: string,
    launchDate: number,
    rocketName: string,
    launchSite: string,
}
