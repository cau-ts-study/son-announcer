interface Match {
  teams: { home: { id: number}, away: { id: number} }
  fixture: {id: number, date: string}
}

interface LineUpPlayer {
  player: { number: number, name: string }
}

interface LineUpData {
  team: { id: number, name: string }
  startXI: LineUpPlayer[]
  substitutes: LineUpPlayer[]
}

interface PlayerStatistics {
  games: { minutes: number, rating: string }
  goals: { total: number | null, assists: number | null }
}

interface RatingData {
  players: { player: {id: number}, statistics: PlayerStatistics[] }[]
}

interface UpcomingMatchResponse {
  data: { response?: Array<Match>, errors?: any }
}

interface LineUpResponse {
  data: { response?: LineUpData[], errors?: any }
}

interface RatingResponse {
  data: { response?: RatingData[], errors?: any }
}