export interface Match {
  teams: { home: { id: number }; away: { id: number } };
  fixture: { id: number; date: string; status: { short: string } };
}

export interface LineUpPlayer {
  player: { id: number; number: number; name: string };
}

export interface LineUpData {
  team: { id: number; name: string };
  startXI: LineUpPlayer[];
  substitutes: LineUpPlayer[];
}

export interface EventData {
  time: { elapsed: number };
  player: { id: number; name: string };
  assist: { id: number; name: string };
  type: string;
  detail: string;
}

export interface Statistics {
  player: {
    id: number;
  };
  statistics: PlayerStatistics[];
}

export interface PlayerStatistics {
  games: { minutes: number; rating: string };
  goals: { total: number | null; assists: number | null };
}

export interface RatingData {
  players: { player: { id: number }; statistics: PlayerStatistics[] }[];
}

export interface UpcomingMatchResponse {
  data: { response?: Array<Match>; errors?: any };
}

export interface LineUpResponse {
  data: { response?: LineUpData[]; errors?: any };
}

export interface EventResponse {
  data: { response?: EventData[]; errors?: any };
}

export interface RatingResponse {
  data: { response?: RatingData[]; errors?: any };
}
