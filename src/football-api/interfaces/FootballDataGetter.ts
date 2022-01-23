import { ErrorMessage } from "../enitities/ErrorMessage";
import { LineUp } from "../enitities/LineUp";
import { MatchEvent } from "../enitities/MatchEvent";
import { MatchStatistics } from "../enitities/MatchStatistics";
import { UpcomingMatch } from "../enitities/UpcomingMatch";

export default interface FootballDataGetter {
  getUpcomingMatch(team: number): Promise<UpcomingMatch | ErrorMessage>;
  getLineUp(matchId: number): Promise<LineUp | ErrorMessage>;
  getEvent(matchId: number): Promise<MatchEvent | ErrorMessage>;
  getRating(matchId: number, playerId: number): Promise<MatchStatistics | ErrorMessage>
}