import FootballDataGetter from "./interfaces/FootballDataGetter";
import dotenv from "dotenv";
import ApiHandler from "./interfaces/ApiHandler";
import { UpcomingMatch } from "./entities/UpcomingMatch";
import { LineUp } from "./entities/LineUp";
import { ErrorMessage } from "./entities/ErrorMessage";
import { MatchEvent } from "./entities/MatchEvent";
import { resolve } from "path/posix";
import { MatchStatistics } from "./entities/MatchStatistics";
import { LINEUP, LINEUP_TYPE } from "./entities/TelegramInterface";
import { start } from "repl";

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
    const response = await this.apiHandler.requestData(url, options) as GetUpcomingMatchResponse;
    if (response && response.data.response) {
      const data = response.data.response
      const matchesOfTeam = data.filter((match) => (match.teams.home.id == team || match.teams.away.id == team));
      const matchSchedulesOfTeam = matchesOfTeam.map(((match) => { return {
        ID: match.fixture.id, 
        date: new Date((new Date(match.fixture.date)).getTime() + this.KR_TIME_DIFF)
      } }))
      matchSchedulesOfTeam.sort((a, b) => a.date.getTime()  - b.date.getTime())
      return matchSchedulesOfTeam[0]
    }
    console.log(response.data.errors)
    return { msg: "error"}
  }

  public async getLineUp(team: number, matchId: number, playerId: number): Promise<LINEUP | ErrorMessage> {
    const params = {
      fixture: matchId
    };
    const options = { params, headers: this.headers }
    const url = "https://v3.football.api-sports.io/fixtures/lineups"
    const response = await this.apiHandler.requestData(url, options) as GetLineUpResponse;
    if (response && response.data.response) {
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
    console.log(response.data.errors)
    return { msg: "error"}
  }

  public getEvent(): Promise<MatchEvent | ErrorMessage> {
    return new Promise(() => null)
  }

  public getRating(): Promise<MatchStatistics | ErrorMessage> {
    return new Promise(() => null)
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