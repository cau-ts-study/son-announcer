import { ErrorMessage } from "../entities/ErrorMessage";
import { LineUp } from "../entities/LineUp";
import { MatchEvent } from "../entities/MatchEvent";
import { MatchStatistics } from "../entities/MatchStatistics";
import { UpcomingMatch } from "../entities/UpcomingMatch";

export default interface FootballDataGetter {
  getUpcomingMatch(team: number): Promise<UpcomingMatch | ErrorMessage>;
  getLineUp(matchId: number): Promise<LineUp | ErrorMessage>;
  getEvent(matchId: number): Promise<MatchEvent | ErrorMessage>;
  getRating(matchId: number, playerId: number): Promise<MatchStatistics | ErrorMessage>
}