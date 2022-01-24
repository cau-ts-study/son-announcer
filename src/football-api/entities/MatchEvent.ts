export interface MatchEvent {
  state: "Not Started" | "Live" | "Finished"
  event?: {
    time: number;
    type: "Goal" | "YellowCard" | "RedCard" | "SubIn" | "SubOut" | "GoalCancelled"
    player: string;
    goalCount?: number;
    assist?: string;
  }
}