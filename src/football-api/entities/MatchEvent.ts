import { FIXTURE } from "./TelegramInterface";

export interface MatchEvent {
  live: boolean;
  events: FIXTURE[];
}
