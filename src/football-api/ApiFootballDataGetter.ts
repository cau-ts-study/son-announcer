import FootballDataGetter from "./interfaces/FootballDataGetter";
import dotenv from "dotenv";
import ApiHandler from "./interfaces/ApiHandler";
import { UpcomingMatch } from "./entities/UpcomingMatch";
import { ErrorMessage } from "./entities/ErrorMessage";
import { MatchEvent } from "./entities/MatchEvent";
import {
  FIXTURE,
  FIXTURE_TYPE,
  LINEUP,
  LINEUP_TYPE,
  RATING,
} from "./entities/TelegramInterface";
import {
  EventData,
  EventResponse,
  LineUpResponse,
  RatingResponse,
  UpcomingMatchResponse,
} from "./entities/ApiFootballResponse";

export default class ApiFootballDataGetter implements FootballDataGetter {
  private apiHandler: ApiHandler;
  private headers: object;
  private events: string[] = [];
  private goals = 0;
  private endCount = 0;
  private playerEventCount = 0;
  private eventCount = 0;

  public constructor(apiHandler: ApiHandler) {
    dotenv.config();
    this.apiHandler = apiHandler;
    this.headers = {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": process.env.API_KEY,
    };
  }

  public async getUpcomingMatch(
    team: number
  ): Promise<UpcomingMatch | ErrorMessage> {
    const params = {
      team: team,
      next: 1,
      timezone: "Asia/Seoul",
    };
    const options = { params, headers: this.headers };
    const url = "https://v3.football.api-sports.io/fixtures";
    const response = (await this.apiHandler.requestData(
      url,
      options
    )) as UpcomingMatchResponse;
    if (response && response.data.response) {
      if (response.data.response.length == 0) {
        return { msg: "no data" };
      }
      const data = response.data.response;
      const nextMatch = {
        ID: data[0].fixture.id,
        date: new Date(new Date(data[0].fixture.date).getTime()),
      };
      return nextMatch;
    }
    console.log(response.data.errors);
    return { msg: "error" };
  }

  public async getLineUp(
    team: number,
    matchId: number,
    playerId: number
  ): Promise<LINEUP | ErrorMessage> {
    const params = {
      fixture: matchId,
    };
    const options = { params, headers: this.headers };
    const url = "https://v3.football.api-sports.io/fixtures/lineups";
    const response = (await this.apiHandler.requestData(
      url,
      options
    )) as LineUpResponse;
    if (response && response.data.response) {
      if (response.data.response.length == 0) {
        return { msg: "no data" };
      }
      this.events.length = 0;
      this.goals = 0;
      this.endCount = 0;
      this.playerEventCount = 0;
      this.eventCount = 0;
      const data = response.data.response;
      const target = data[0].team.id == team ? 0 : 1;
      const enemy = 1 - target;
      const UpcomingMatch = (await this.getUpcomingMatch(
        team
      )) as UpcomingMatch;
      const time = UpcomingMatch.date;
      const startXI = data[target].startXI;
      const substitutes = data[target].substitutes;
      let type: LINEUP_TYPE;
      if (
        startXI.filter((player) => player.player.id == playerId).length == 1
      ) {
        type = LINEUP_TYPE.STARTING;
      } else {
        if (
          substitutes.filter((player) => player.player.id == playerId).length ==
          1
        ) {
          type = LINEUP_TYPE.BENCH;
        } else {
          type = LINEUP_TYPE.EXCLUDED;
        }
      }
      const lineupData = startXI.map(
        (player) => player.player.number.toString() + ". " + player.player.name
      );
      const lineup = lineupData.join("\n");
      const opponent = data[enemy].team.name;
      const result: LINEUP = { time, type, lineup, opponent };
      return result;
    }
    console.log(response.data.errors);
    return { msg: "error" };
  }

  public async getEvents(matchId: number): Promise<EventData[] | ErrorMessage> {
    const params = {
      fixture: matchId,
    };
    const options = { params, headers: this.headers };
    const url = "https://v3.football.api-sports.io/fixtures/events";
    const response = (await this.apiHandler.requestData(
      url,
      options
    )) as EventResponse;
    if (response && response.data.response) {
      const data = response.data.response;
      return data;
    }
    console.log(response.data.errors);
    return { msg: "error" };
  }

  public async getNewEvents(
    matchId: number,
    playerId: number
  ): Promise<MatchEvent | ErrorMessage> {
    const data = await this.getEvents(matchId);
    if (!("msg" in data)) {
      const simplifiedData = data.map(
        (event) =>
          event.time.elapsed.toString() +
          " " +
          event.player.name +
          " " +
          event.type +
          " with " +
          event.assist.name
      );
      console.log(simplifiedData.join("\n"));
      const matchEvent: MatchEvent = { live: true, events: [] };
      const playerEvents = data.filter(
        (event) =>
          (event.player.id == playerId || event.assist.id == playerId) &&
          event.detail !== "Goal confirmed"
      );
      const newPlayerEvents = playerEvents.slice(this.playerEventCount);
      this.playerEventCount += newPlayerEvents.length;
      newPlayerEvents.forEach((event) => {
        const isMain = event.player.id == playerId;
        let type: FIXTURE_TYPE;
        switch (event.type) {
          case "Goal":
            if (isMain) {
              this.goals += 1;
              type = FIXTURE_TYPE.GOAL;
            } else {
              type = FIXTURE_TYPE.ASSIST;
            }
            break;
          case "Card":
            if (event.detail == "Yellow Card") {
              type = FIXTURE_TYPE.YC;
            } else {
              type = FIXTURE_TYPE.RC;
            }
            break;
          case "subst":
            if (isMain) {
              type = FIXTURE_TYPE.SUBIN;
            } else {
              type = FIXTURE_TYPE.SUBOUT;
            }
            break;
          case "Var":
            type = FIXTURE_TYPE.GOALCANCELLED;
            this.goals -= 1;
            break;
          default:
            return { msg: "error" };
        }
        const fixture: FIXTURE = {
          time: event.time.elapsed,
          type: type,
        };
        if (fixture.type == FIXTURE_TYPE.GOAL) {
          fixture.goalCount = this.goals;
        }
        matchEvent.events.push(fixture);
      });
      if (data.length == this.eventCount) {
        const status = await this.getMatchStatus(matchId);
        // const status = "2H"
        if (typeof status == "string") {
          console.log("match status: " + status);
          if (
            [
              "FT",
              "AET",
              "PEN",
              "SUSP",
              "INT",
              "PST",
              "CANC",
              "ABD",
              "AWD",
              "WO",
            ].includes(status)
          ) {
            this.endCount += 1;
          }
        } else {
          this.endCount += 1;
        }
      }
      this.eventCount = data.length;
      if (this.endCount >= 2) {
        matchEvent.live = false;
      }
      return matchEvent;
    }
    console.log(data);
    return { msg: "error" };
  }

  public async getMatchStatus(matchId: number): Promise<string | ErrorMessage> {
    const params = {
      id: matchId,
    };
    const options = { params, headers: this.headers };
    const url = "https://v3.football.api-sports.io/fixtures";
    const response = (await this.apiHandler.requestData(
      url,
      options
    )) as UpcomingMatchResponse;
    if (
      response &&
      response.data.response &&
      response.data.response.length > 0
    ) {
      const data = response.data.response;
      return data[0].fixture.status.short;
    }
    return "FT";
  }

  public async getRating(
    matchId: number,
    team: number,
    playerId: number
  ): Promise<RATING | ErrorMessage> {
    const params = {
      fixture: matchId,
      team: team,
    };
    const options = { params, headers: this.headers };
    const url = "https://v3.football.api-sports.io/fixtures/players";
    const response = (await this.apiHandler.requestData(
      url,
      options
    )) as RatingResponse;
    if (response && response.data.response) {
      if (response.data.response.length == 0) {
        return { msg: "no data" };
      }
      const data = response.data.response[0].players;
      const playerStatistics = data.filter(
        (statistics) => statistics.player.id == playerId
      )[0];
      const goal = playerStatistics.statistics[0].goals.total
        ? playerStatistics.statistics[0].goals.total
        : 0;
      const assist = playerStatistics.statistics[0].goals.assists
        ? playerStatistics.statistics[0].goals.assists
        : 0;
      const Rating: RATING = {
        rating: Number(playerStatistics.statistics[0].games.rating),
        goal,
        assist,
        playtime: playerStatistics.statistics[0].games.minutes,
      };
      return Rating;
    }
    console.log(response.data.errors);
    return { msg: "error" };
  }
}
