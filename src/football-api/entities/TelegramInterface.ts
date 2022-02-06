// Interfaces
export interface EVENT {
    type: EVENT_TYPE;
    content: LINEUP | RATING | FIXTURE;
}

export interface LINEUP {
    time: Date;
    type: LINEUP_TYPE;
    lineup: string;
    opponent: string;
}

export interface RATING {
    rating: number;
    goal: number;
    assist: number;
    playtime: number;   
}

export interface FIXTURE {
    time: number;
    type: FIXTURE_TYPE;
    goalCount?: number;
}


// Enums
export enum EVENT_TYPE {
    LINEUP = "LINEUP",
    RATING = "RATING",
    FIXTURE = "FIXTURE",
}

export enum LINEUP_TYPE {
    STARTING = "STARTING",
    BENCH = "BENCH",
    EXCLUDED = "EXCLUDED",
}

export enum FIXTURE_TYPE {
    GOAL = "GOAL",
    ASSIST = "ASSIST",
    YC = "YELLOW_CARD",
    RC = "RED_CARD",
    SUBIN = "SUBIN",
    SUBOUT = "SUBOUT",
    GOALCANCELLED = "GOAL_CANCELLED",
}