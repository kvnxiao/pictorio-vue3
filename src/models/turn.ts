import { TurnStatus } from "./status"

export interface BaseTurnEvent {
  maxTime: number
  timeLeft: number
  status: TurnStatus
}
