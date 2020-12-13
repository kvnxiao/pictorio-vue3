import { User } from "./user"

export interface PlayerState {
  user: User
  points: number
  wins: number
  isSpectator: boolean
  isConnected: boolean
  isReady: boolean
  isRoomLeader: boolean
}
