interface Match {
  teams: { home: { id: number}, away: { id: number} }
  fixture: { id: number, date: string, status: {short: string} }
}

interface LineUpPlayer {
  player: { number: number, name: string }
}

interface LineUpData {
  team: { id: number, name: string }
  startXI: LineUpPlayer[]
  substitutes: LineUpPlayer[]
}

interface EventData {
  time: { elapsed: number }
  player: { id: number, name: string }
  assist: { id: number, name: string }
  type: string
  detail: string
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

interface EventResponse {
  data: { response?: EventData[], errors?: any }
}

interface RatingResponse {
  data: { response?: RatingData[], errors?: any }
}