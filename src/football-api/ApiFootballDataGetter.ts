import FootballDataGetter from "./interfaces/FootballDataGetter";
import dotenv from "dotenv";
import ApiHandler from "./interfaces/ApiHandler";
import { UpcomingMatch } from "./enitities/UpcomingMatch";
import { LineUp } from "./enitities/LineUp";
import { ErrorMessage } from "./enitities/ErrorMessage";
import { MatchEvent } from "./enitities/MatchEvent";
import { resolve } from "path/posix";
import { MatchStatistics } from "./enitities/MatchStatistics";

interface Match {
  teams: { home: { id: number}, away: { id: number} }
  fixture: {id: number, date: string}
}

interface Response {
  data: { response?: Array<Match>, errors?: any }
}

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
    const response = await this.apiHandler.requestData(url, options) as Response;
    if (response && response.data.response) {
      console.log(response.data.response[0].fixture)
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

  public getLineUp(): Promise<LineUp | ErrorMessage> {
    return new Promise(() => null)
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