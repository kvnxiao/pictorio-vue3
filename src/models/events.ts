import {
  ChatRehydrate,
  DrawingRehydrate,
  GameRehydrate,
  PlayersRehydrate,
  UserRehydrate,
} from "./rehydrate"
import { BaseTurnEvent } from "./turn"
import { Hint } from "./hint"
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
  NewGameIssued = 14,
  NewGameReset = 15,
  DrawTemp = 16,
  DrawSelectColour = 17,
  DrawSelectThickness = 18,
  DrawTempStop = 19,

  // For big payloads sent by the client
  MultiPartPayload = 99,
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
  [EventType.NewGameIssued]: NewGameIssuedEvent
  [EventType.NewGameReset]: NewGameResetEvent
  [EventType.DrawTemp]: DrawTempEvent
  [EventType.DrawSelectColour]: DrawSelectColourEvent
  [EventType.DrawSelectThickness]: DrawSelectThicknessEvent
  [EventType.DrawTempStop]: DrawTempEvent
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

export enum ChatEventType {
  SYSTEM = 0,
  USER = 1,
  JOIN = 2,
  LEAVE = 3,
  GUESSED = 4,
}

export interface ChatEvent {
  user: User
  message: string
  format: string
  type: ChatEventType
}

export enum DrawEventType {
  UNDO = 0,
  REDO = 1,
  CLEAR = 2,
}

export interface DrawEvent {
  user: User
  type: DrawEventType
}

export interface DrawTempEvent {
  user: User
  line: Line
}

export interface DrawSelectColourEvent {
  user: User
  colourIdx: number
}

export interface DrawSelectThicknessEvent {
  user: User
  thicknessIdx: number
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
    round: number
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
  hints?: Hint[]
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

export interface NewGameIssuedEvent {
  issuer: User
}

export interface NewGameResetEvent {
  playerStates: PlayerState[]
}

export interface GameEvent {
  type: EventType
  data: unknown
}
