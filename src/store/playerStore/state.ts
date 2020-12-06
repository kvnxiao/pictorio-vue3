import { Player } from "@/models/player"

export interface PlayerState {
  selfPlayer: Player
  players: Player[]
}

export const state: PlayerState = {
  selfPlayer: { id: "", name: "" },
  players: [],
}
