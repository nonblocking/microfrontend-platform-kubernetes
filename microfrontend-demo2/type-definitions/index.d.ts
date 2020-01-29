
export type SpaceXApiNextLaunchResponse = {
    flight_number: number,
    mission_name: string,
    launch_date_unix: number,
    is_tentative: boolean,
    rocket: {
        rocket_id: string,
        rocket_name: string,
        rocket_type: string
    },
    launch_site: {
        site_id: string,
        site_name: string,
        site_name_long: string,
    }
}

export type NextLaunch = {
    flightNumber: number,
    missionName: string,
    launchDate: number,
    rocketName: string,
    launchSite: string,
}
