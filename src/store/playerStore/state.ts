import { Player } from "@/models/player"

export enum Status {
  JOINED = 0,
  LEFT = 1,
}

export interface PlayerStatus {
  player: Player
  status: Status
}

export interface PlayerState {
  selfPlayer: Player
  playerIds: {
    [playerId: string]: PlayerStatus
  }
}

export const state: PlayerState = {
  selfPlayer: { id: "", name: "" },
  playerIds: {},
}
