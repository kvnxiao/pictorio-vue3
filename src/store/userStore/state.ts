import { PlayerState } from "@/models/playerState"
import { User } from "@/models/user"

export interface UserState {
  selfUser: User
  playerStates: {
    [userId: string]: PlayerState
  }
}

export const state: UserState = {
  selfUser: { id: "", name: "" },
  playerStates: {},
}
