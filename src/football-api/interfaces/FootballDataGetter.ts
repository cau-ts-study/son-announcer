import { ErrorMessage } from "../entities/ErrorMessage";
import { MatchEvent } from "../entities/MatchEvent";
import { LINEUP, RATING } from "../entities/TelegramInterface";
import { UpcomingMatch } from "../entities/UpcomingMatch";

export default interface FootballDataGetter {
  getUpcomingMatch(team: number): Promise<UpcomingMatch | ErrorMessage>;
  getLineUp(
    team: number,
    matchId: number,
    playerId: number
  ): Promise<LINEUP | ErrorMessage>;
  getNewEvents(
    matchId: number,
    playerId: number
  ): Promise<MatchEvent | ErrorMessage>;
  getRating(
    matchId: number,
    team: number,
    playerId: number
  ): Promise<RATING | ErrorMessage>;
}
