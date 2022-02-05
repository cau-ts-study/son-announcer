import FootballDataGetter from "./interfaces/FootballDataGetter";
import dotenv from "dotenv";
import ApiHandler from "./interfaces/ApiHandler";
import { UpcomingMatch } from "./entities/UpcomingMatch";
import { ErrorMessage } from "./entities/ErrorMessage";
import { MatchEvent } from "./entities/MatchEvent";
import { resolve } from "path/posix";
import { FIXTURE, FIXTURE_TYPE, LINEUP, LINEUP_TYPE, RATING } from "./entities/TelegramInterface";
import { isString } from "util";

export default class ApiFootballDataGetter implements FootballDataGetter {
  private apiHandler: ApiHandler;
  private headers: object;
  private KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  private events: String[] = [];
  private goals: number = 0;
  private endCount: number = 0;

  public constructor(apiHandler: ApiHandler) {
    dotenv.config();
    this.apiHandler = apiHandler
    this.headers = {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": process.env.API_KEY,
    }
  }

  public async getUpcomingMatch(team: number): Promise< UpcomingMatch | ErrorMessage> {
    const [startDate, endDate] = this.getDate();
    const params = {
      season: 2021,
      league: 39, 
      from: startDate,
      to: endDate,
      timezone: "Asia/Seoul",
    };
    const options = { params, headers: this.headers }
    const url = "https://v3.football.api-sports.io/fixtures"
    const response = await this.apiHandler.requestData(url, options) as UpcomingMatchResponse;
    if (response && response.data.response) {
      if (response.data.response.length == 0) {
        return { msg: "no data"}
      }
      const data = response.data.response
      const matchesOfTeam = data.filter((match) => (match.teams.home.id == team || match.teams.away.id == team));
      const matchSchedulesOfTeam = matchesOfTeam.map(((match) => { return {
        ID: match.fixture.id, 
        date: new Date((new Date(match.fixture.date)).getTime() + this.KR_TIME_DIFF)
      } }))
      matchSchedulesOfTeam.sort((a, b) => a.date.getTime()  - b.date.getTime())
      return matchSchedulesOfTeam[0]
    }
    console.log(response.data.errors);
    return { msg: "error"};
  }

  public async getLineUp(team: number, matchId: number, playerId: number): Promise<LINEUP | ErrorMessage> {
    const params = {
      fixture: matchId
    };
    const options = { params, headers: this.headers }
    const url = "https://v3.football.api-sports.io/fixtures/lineups"
    const response = await this.apiHandler.requestData(url, options) as LineUpResponse;
    if (response && response.data.response) {
      if (response.data.response.length == 0) {
        return { msg: "no data"}
      }
      this.events.length = 0;
      this.goals = 0;
      this.endCount = 0;
      const data = response.data.response;
      const target = data[0].team.id == team ? 0 : 1;
      const enemy = 1 - target;
      const UpcomingMatch = await this.getUpcomingMatch(team) as UpcomingMatch;
      const time = UpcomingMatch.date;
      const startXI = data[target].startXI;
      const substitutes = data[target].substitutes;
      let type: LINEUP_TYPE;
      if ( startXI.filter((player) => player.player.number == playerId).length == 1 ) {
        type = LINEUP_TYPE.STARTING;
      } else {
        if (substitutes.filter((player) => player.player.number == playerId).length == 1) {
          type = LINEUP_TYPE.BENCH;
        } else {
          type = LINEUP_TYPE.EXCLUDED;
        }
      }
      const lineupData = startXI.map((player) => player.player.number.toString() + ". " + player.player.name)
      const lineup = lineupData.join("\n");
      const opponent = data[enemy].team.name;
      const result: LINEUP = { time, type, lineup, opponent }
      return result;
    }
    console.log(response.data.errors);
    return { msg: "error"};
  }

  public async getEvents(matchId: number, playerId: number): Promise<EventData[] | ErrorMessage> {
    const params = {
      fixture: matchId
    };
    const options = { params, headers: this.headers }
    const url = "https://v3.football.api-sports.io/fixtures/lineups"
    const response = await this.apiHandler.requestData(url, options) as EventResponse;
    if (response && response.data.response) {
      const data = response.data.response;
      return data;
    }
    console.log(response.data.errors);
    return { msg: "error"};
  }

  public async getNewEvents(matchId: number, playerId: number): Promise<MatchEvent | ErrorMessage> {
    const data = await this.getEvents(matchId, playerId);
    if (!("msg" in data)) {
      const matchEvent:MatchEvent = {live: true, events: []}
      const playerEvents = data.filter((event) => ((event.player.id == playerId) || (event.assist.id == playerId)) && event.detail !== "Goal confirmed")
      playerEvents.forEach((event) => {
        const isMain = (event.player.id == playerId);
        const stringifiedEvent = JSON.stringify(event);
        if (this.events.filter((event) => event == stringifiedEvent).length == 1) {
          let type:FIXTURE_TYPE;
          switch(event.type) {
            case "Goal":
              if (isMain) { 
                this.goals += 1
                type = FIXTURE_TYPE.GOAL;
              } else {
                type = FIXTURE_TYPE.ASSIST;
              }
              break
            case "Card":
              if (event.detail == "Yellow Card") {
                type = FIXTURE_TYPE.YC;
              } else {
                type = FIXTURE_TYPE.RC;
              }
              break
            case "Subst":
              if (isMain) {
                type = FIXTURE_TYPE.SUBOUT;
              } else {
                type = FIXTURE_TYPE.SUBIN;
              }
              break
            case "Var":
              type = FIXTURE_TYPE.GOALCANCELLED;
              this.goals -= 1;
              break
            default:
              return { msg: "error"}
          }
          const fixture: FIXTURE = {
            time: event.time.elapsed,
            type: type,
          }
          if (fixture.type == FIXTURE_TYPE.GOAL) {
            fixture.goalCount = this.goals;
          }
          matchEvent.events.push(fixture);
        }
        this.events.push(stringifiedEvent);
      });
      if (matchEvent.events.length == 0) {
        const status = await this.getMatchStatus(matchId);
        if (typeof status == 'string') {
          if (status in ["FT","AET","PEN","SUSP","INT","PST","CANC","ABD","AWD","WO"]) {
            this.endCount += 1;
          }
        } else { this.endCount += 1; }
      }
      if (this.endCount >= 2) {
        matchEvent.live = false;
      }
      return matchEvent;
    }
    console.log(data);
    return { msg: "error"};
  }

  public async getMatchStatus(matchId: number): Promise<String | ErrorMessage> {
    const params = {
      fixture: matchId
    };
    const options = { params, headers: this.headers };
    const url = "https://v3.football.api-sports.io/fixtures"
    const response = await this.apiHandler.requestData(url, options) as UpcomingMatchResponse;
    if (response && response.data.response) {
      const data = response.data.response
      return data[0].fixture.status.short;
    }
    return "FT"
  }

  public async getRating(matchId: number, team: number, playerId: number): Promise<RATING | ErrorMessage> {
    const params = {
      fixture: matchId,
      team: team
    };
    const options = { params, headers: this.headers };
    const url = "https://v3.football.api-sports.io/fixtures/players"
    const response = await this.apiHandler.requestData(url, options) as RatingResponse;
    if (response && response.data.response) {
      if (response.data.response.length == 0) {
        return { msg: "no data"}
      }
      const data = response.data.response[0].players;
      const playerStatistics = data.filter((statistics) => statistics.player.id == playerId)[0];
      const goal = playerStatistics.statistics[0].goals.total ? playerStatistics.statistics[0].goals.total : 0;
      const assist = playerStatistics.statistics[0].goals.assists ? playerStatistics.statistics[0].goals.assists : 0;
      const Rating: RATING = {
        rating: Number(playerStatistics.statistics[0].games.rating),
        goal,
        assist,
        playtime: playerStatistics.statistics[0].games.minutes
      }
      return Rating;
    }
    console.log(response.data.errors)
    return { msg: "error"}
  }

  private getDate(): [string, string] {
    const now = new Date();
    const end = new Date();
    now.setDate(now.getDate());
    end.setMonth(now.getMonth() + 1);
    const startDate = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + (now.getDate())).slice(-2);
    const endDate = end.getFullYear() + "-" + ("0" + (end.getMonth() + 1)).slice(-2) + "-" + ("0" + (end.getDate())).slice(-2);
    return [startDate, endDate];
  }

}