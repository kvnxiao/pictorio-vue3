import { ChatMessage } from "./message"
import { Line } from "./drawing"
import { Player } from "./player"

export enum EventType {
  PlayerActionEvent = 0,
  SelfJoinEvent = 1,
  RehydrateEvent = 2,
  ChatEvent = 3,
  DrawEvent = 4,
}

export interface GameEventTypeMap {
  [EventType.PlayerActionEvent]: PlayerActionEvent
  [EventType.SelfJoinEvent]: SelfJoinEvent
  [EventType.RehydrateEvent]: RehydrateEvent
  [EventType.ChatEvent]: ChatEvent
  [EventType.DrawEvent]: DrawEvent
}

export enum PlayerAction {
  LEAVE = 0,
  JOIN = 1,
}

export interface SelfJoinEvent {
  player: Player
}

export interface PlayerActionEvent {
  player: Player
  action: PlayerAction
}

export interface RehydrateEvent {
  players: Player[]
}

export interface ChatEvent {
  player: Player
  message: ChatMessage
}

export interface DrawEvent {
  player: Player
  line: Line
}

export interface GameEvent {
  type: EventType
  data: unknown
}
