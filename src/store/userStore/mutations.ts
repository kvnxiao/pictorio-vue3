import {
  AwardPointsEvent,
  NewGameResetEvent,
  ReadyEvent,
  RehydrateEvent,
  StartGameEvent,
} from "@/models/events"
import { MutationTree } from "vuex"
import { PlayerState } from "@/models/playerState"
import { UserState } from "./state"

export enum UserMutations {
  RESET = "RESET",
  REHYDRATE = "REHYDRATE",
  USER_JOINED = "USER_JOINED",
  USER_LEFT = "USER_LEFT",
  USER_READY = "USER_READY",
  ADD_POINTS = "ADD_POINTS",
  START_GAME = "START_GAME",
  NEW_GAME = "NEW_GAME",
}

export interface Mutations<S = UserState> {
  [UserMutations.RESET](state: S): void
  [UserMutations.REHYDRATE](state: S, event: RehydrateEvent): void
  [UserMutations.USER_JOINED](state: S, player: PlayerState): void
  [UserMutations.USER_LEFT](state: S, player: PlayerState): void
  [UserMutations.USER_READY](state: S, event: ReadyEvent): void
  [UserMutations.ADD_POINTS](state: S, event: AwardPointsEvent): void
  [UserMutations.START_GAME](state: S, event: StartGameEvent): void
  [UserMutations.NEW_GAME](state: S, event: NewGameResetEvent): void
}

export const mutations: MutationTree<UserState> & Mutations = {
  [UserMutations.RESET](state: UserState) {
    state.selfUser = { id: "", name: "" }
    state.playerStates = {}
  },
  [UserMutations.REHYDRATE](state: UserState, event: RehydrateEvent) {
    state.selfUser = event.selfUser
    for (const playerState of event.players.playerStates) {
      state.playerStates[playerState.user.id] = playerState
    }
  },
  [UserMutations.USER_JOINED](state: UserState, player: PlayerState) {
    if (player.user.id in state.playerStates) {
      state.playerStates[player.user.id].isConnected = true
      state.playerStates[player.user.id].isReady = false
      // Update user name in case the user changed their name
      state.playerStates[player.user.id].user.name = player.user.name
    } else {
      // New user joined
      state.playerStates[player.user.id] = player
    }
  },
  [UserMutations.USER_LEFT](state: UserState, player: PlayerState) {
    if (player.user.id in state.playerStates) {
      state.playerStates[player.user.id].isConnected = false
      state.playerStates[player.user.id].isReady = false
    }
  },
  [UserMutations.USER_READY](state: UserState, event: ReadyEvent) {
    if (event.user.id in state.playerStates) {
      state.playerStates[event.user.id].isReady = event.ready
    }
  },
  [UserMutations.ADD_POINTS](state: UserState, event: AwardPointsEvent) {
    if (
      event.guesser.id in state.playerStates &&
      event.drawer.id in state.playerStates
    ) {
      state.playerStates[event.guesser.id].points += event.guesserPoints
      state.playerStates[event.drawer.id].points += event.drawerPoints
    }
  },
  [UserMutations.START_GAME](state: UserState, event: StartGameEvent) {
    for (const playerIDs of event.playerOrderIds) {
      if (state.playerStates[playerIDs]) {
        state.playerStates[playerIDs].isReady = false
      }
    }
  },
  [UserMutations.NEW_GAME](state: UserState, event: NewGameResetEvent) {
    for (const playerState of event.playerStates) {
      if (state.playerStates[playerState.user.id]) {
        state.playerStates[playerState.user.id].isReady = false
        state.playerStates[playerState.user.id].points = 0
      }
    }
  },
}
