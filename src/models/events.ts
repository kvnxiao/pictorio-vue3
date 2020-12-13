import { Line } from "./drawing"
import { PlayerState } from "./playerState"
import { User } from "./user"

export enum EventType {
  UserJoinLeaveEvent = 0,
  RehydrateEvent = 1,
  ChatEvent = 2,
  DrawEvent = 3,
}

export interface GameEventTypeMap {
  [EventType.UserJoinLeaveEvent]: UserJoinLeaveEvent
  [EventType.RehydrateEvent]: RehydrateEvent
  [EventType.ChatEvent]: ChatEvent
  [EventType.DrawEvent]: DrawEvent
}

export enum UserJoinLeaveAction {
  JOIN = 0,
  LEAVE = 1,
}

export enum GameStatus {
  WaitingReadyUp = 0,
  Started = 1,
  GameOver = 2,
}

export interface UserRehydrateEvent {
  selfUser: User
  playerStates: PlayerState[]
}

export interface ChatRehydrateEvent {
  chatMessages: ChatEvent[]
}

export interface GameRehydrateEvent {
  gameStatus: GameStatus
  currentUserTurn?: User
  lines: Line[]
}

/**
 * RehydrateEvent should be a server-sided event that allows the connected client to
 * restore the current state of the game. Clients should not be sending a RehydrateEvent
 * to the server.
 */
export type RehydrateEvent = UserRehydrateEvent &
  ChatRehydrateEvent &
  GameRehydrateEvent

export interface UserJoinLeaveEvent {
  user: User
  action: UserJoinLeaveAction
}

export interface ChatEvent {
  user: User
  message: string
  isSystem?: boolean
}

export interface DrawEvent {
  user: User
  line: Line
}

export interface GameEvent {
  type: EventType
  data: unknown
}
