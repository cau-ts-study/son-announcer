import { ErrorMessage } from "../entities/ErrorMessage";
import { LineUp } from "../entities/LineUp";
import { MatchEvent } from "../entities/MatchEvent";
import { MatchStatistics } from "../entities/MatchStatistics";
import { LINEUP } from "../entities/TelegramInterface";
import { UpcomingMatch } from "../entities/UpcomingMatch";

export default interface FootballDataGetter {
  getUpcomingMatch(team: number): Promise<UpcomingMatch | ErrorMessage>;
  getLineUp(team: number, matchId: number, playerId: number): Promise<LINEUP | ErrorMessage>;
  getEvent(matchId: number): Promise<MatchEvent | ErrorMessage>;
  getRating(matchId: number, player: number): Promise<MatchStatistics | ErrorMessage>
}