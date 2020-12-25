import {
  ChatRehydrate,
  DrawingRehydrate,
  GameRehydrate,
  PlayersRehydrate,
  UserRehydrate,
} from "./rehydrate"
import { BaseTurnEvent } from "./turn"
import { Line } from "./drawing"
import { PlayerState } from "./playerState"
import { User } from "./user"
import { Winner } from "./winner"

export enum EventType {
  UserJoinLeave = 0,
  Rehydrate = 1,
  Chat = 2,
  Draw = 3,
  Ready = 4,
  StartGame = 5,
  StartGameIssued = 6,
  TurnNextPlayer = 7,
  TurnWordSelection = 8,
  TurnWordSelected = 9,
  TurnDrawing = 10,
  TurnEnd = 11,
  AwardPoints = 12,
  GameOver = 13,
}

export interface GameEventTypeMap {
  [EventType.UserJoinLeave]: UserJoinLeaveEvent
  [EventType.Rehydrate]: RehydrateEvent
  [EventType.Chat]: ChatEvent
  [EventType.Draw]: DrawEvent
  [EventType.Ready]: ReadyEvent
  [EventType.StartGame]: StartGameEvent
  [EventType.StartGameIssued]: StartGameIssuedEvent
  [EventType.TurnNextPlayer]: TurnNextPlayerEvent
  [EventType.TurnWordSelection]: TurnWordSelectionEvent
  [EventType.TurnWordSelected]: TurnWordSelectedEvent
  [EventType.TurnDrawing]: TurnDrawingEvent
  [EventType.TurnEnd]: TurnEndEvent
  [EventType.AwardPoints]: AwardPointsEvent
  [EventType.GameOver]: GameOverEvent
}

export enum UserJoinLeaveAction {
  JOIN = 0,
  LEAVE = 1,
}

/**
 * RehydrateEvent should be a server-sided event that allows the connected client to
 * restore the current state of the game. Clients should not be sending a RehydrateEvent
 * to the server.
 */
export type RehydrateEvent = UserRehydrate &
  ChatRehydrate &
  PlayersRehydrate &
  GameRehydrate &
  DrawingRehydrate

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
}

export interface StartGameIssuedEvent {
  issuer: User
}

export interface TurnNextPlayerEvent extends BaseTurnEvent {
  nonce?: {
    nextTurnUser: User
  }
}

export interface TurnWordSelectionEvent extends BaseTurnEvent {
  nonce?: {
    user: User
    words?: string[]
  }
}

export interface TurnWordSelectedEvent {
  user: User
  index: number
}

export interface TurnDrawingEvent extends BaseTurnEvent {
  nonce?: {
    user: User
    wordLength: number[]
    word?: string
  }
}

export interface TurnEndEvent extends BaseTurnEvent {
  nonce?: {
    user: User
    answer: string
  }
}

export interface AwardPointsEvent {
  guesser: User
  drawer: User
  guesserPoints: number
  drawerPoints: number
}

export interface GameOverEvent {
  winners: Winner[]
}

export interface GameEvent {
  type: EventType
  data: unknown
}
