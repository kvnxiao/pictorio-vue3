import { GameStatus } from "./status"
import { Line } from "./drawing"
import { PlayerState } from "./playerState"
import { User } from "./user"

export enum EventType {
  UserJoinLeave = 0,
  Rehydrate = 1,
  Chat = 2,
  Draw = 3,
  Ready = 4,
  StartGame = 5,
  StartGameIssued = 6,
  TurnBeginSelection,
  TurnWordSelected,
  TurnBeginDrawing,
  TurnCountdown,
  TurnEnd,
}

export interface GameEventTypeMap {
  [EventType.UserJoinLeave]: UserJoinLeaveEvent
  [EventType.Rehydrate]: RehydrateEvent
  [EventType.Chat]: ChatEvent
  [EventType.Draw]: DrawEvent
  [EventType.Ready]: ReadyEvent
  [EventType.StartGame]: StartGameEvent
  [EventType.StartGameIssued]: StartGameIssuedEvent
  [EventType.TurnBeginSelection]: TurnBeginSelectionEvent
  [EventType.TurnWordSelected]: TurnWordSelectedEvent
  [EventType.TurnBeginDrawing]: TurnBeginDrawingEvent
  [EventType.TurnCountdown]: TurnCountdownEvent
  [EventType.TurnEnd]: TurnEndEvent
}

export enum UserJoinLeaveAction {
  JOIN = 0,
  LEAVE = 1,
}

export interface UserRehydrateEvent {
  selfUser: User
  playerStates: PlayerState[]
}

export interface ChatRehydrateEvent {
  chatMessages: ChatEvent[]
}

export interface GameRehydrateEvent {
  maxPlayers: number
  gameStatus: GameStatus
  playerOrderIds: string[]
  currentTurnUser: User | null
  lines?: Line[]
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
  playerState: PlayerState
  action: UserJoinLeaveAction
}

export interface ChatEvent {
  user: User
  message: string
  isSystem?: boolean
}

export enum DrawEventType {
  LINE = 0,
  UNDO = 1,
  REDO = 2,
  CLEAR = 3,
}

export interface DrawEvent {
  user: User
  line?: Line
  type: DrawEventType
}

export interface ReadyEvent {
  user: User
  ready: boolean
}

export interface StartGameEvent {
  playerOrderIds: string[]
  currentTurnUser: User
}

export interface StartGameIssuedEvent {
  issuer: User
}

export interface TurnBeginSelectionEvent {
  user: User
  maxTime: number
  words?: string[]
}

export interface TurnWordSelectedEvent {
  user: User
  index: number
}

export interface TurnBeginDrawingEvent {
  user: User
  maxTime: number
  wordLength: number[]
  word?: string
}

export interface TurnCountdownEvent {
  user: User
  timeLeft: number
}

export interface TurnEndEvent {
  user: User
}

export interface GameEvent {
  type: EventType
  data: unknown
}
