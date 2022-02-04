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

interface GetUpcomingMatchResponse {
  data: { response?: Array<Match>, errors?: any }
}

interface GetLineUpResponse {
  data: { response?: LineUpData[], errors?: any }
}