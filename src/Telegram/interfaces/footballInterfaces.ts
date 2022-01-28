interface LINEUP {
    time: number;
    type: LINEUP_TYPE;
    lineup: string;
    opponent: string;
};

enum LINEUP_TYPE {
    STARTING = "STARTING",
    BENCH = "BENCH",
    EXCLUDED = "EXCLUDED",
};

interface RATING {
    rating: number;
    goal: number;
    assist: number;
    playtime: number;   
}

interface FIXTURE {
    time: number;
    type: FIXTURE_TYPE;
    goalCount?: number;
}

enum FIXTURE_TYPE {
    GOAL = "GOAL",
    ASSIST = "ASSIST",
    YC = "YELLOW_CARD",
    RC = "RED_CARD",
    SUBIN = "SUBIN",
    SUBOUT = "SUBOUT",
    GOALCANCELLED = "GOAL_CANCELLED",
}


interface EVENT {
    type: EVENT_TYPE;
    content: LINEUP | RATING | FIXTURE;
}

enum EVENT_TYPE {
    LINEUP = "LINEUP",
    RATING = "RATING",
    FIXTURE = "FIXTURE"
}

const handler = (event: EVENT) => {
    switch (event.type) {
        case EVENT_TYPE.LINEUP:
            lineupHandler(event.content as LINEUP);
            break;
        case EVENT_TYPE.RATING:
            ratingHandler(event.content as RATING);
            break;
        case EVENT_TYPE.FIXTURE:
            fixtureHandler(event.content as FIXTURE);
            break;
    }
}

const lineupHandler = (lineup: LINEUP) => {

}

const ratingHandler = (rating: RATING) => {
    
}

const fixtureHandler = (fixture: FIXTURE) => {
    
}




const EVENT_MESSAGE = {
    // LINEUP EVENTS
    STARTING: "손흥민 선발!",
    BENCH: "손흥민 벤치",
    EXCLUDED: "손흥민 명단 제외"

    
    
}

