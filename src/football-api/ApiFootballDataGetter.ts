import FootballDataGetter from "./interfaces/FootballDataGetter";
import dotenv from "dotenv";
import ApiHandler from "./interfaces/ApiHandler";
import { UpcomingMatch } from "./entities/UpcomingMatch";
import { ErrorMessage } from "./entities/ErrorMessage";
import { MatchEvent } from "./entities/MatchEvent";
import { resolve } from "path/posix";
import { LINEUP, LINEUP_TYPE, RATING } from "./entities/TelegramInterface";

export default class ApiFootballDataGetter implements FootballDataGetter {
  private apiHandler: ApiHandler;
  private headers: object;
  private KR_TIME_DIFF = 9 * 60 * 60 * 1000;

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

  public async getEvent(matchId: number, playerId: number): Promise<EventData[] | ErrorMessage> {
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