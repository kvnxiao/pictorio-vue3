import { Line } from "./drawing"
import { Player } from "./player"

export enum EventType {
  PlayerJoinLeaveEvent = 0,
  SelfJoinEvent = 1,
  RehydrateEvent = 2,
  ChatEvent = 3,
  DrawEvent = 4,
}

export interface GameEventTypeMap {
  [EventType.PlayerJoinLeaveEvent]: PlayerJoinLeaveEvent
  [EventType.SelfJoinEvent]: SelfJoinEvent
  [EventType.RehydrateEvent]: RehydrateEvent
  [EventType.ChatEvent]: ChatEvent
  [EventType.DrawEvent]: DrawEvent
}

export enum PlayerJoinLeaveAction {
  JOIN = 0,
  LEAVE = 1,
}

export interface SelfJoinEvent {
  player: Player
}

export interface PlayerJoinLeaveEvent {
  player: Player
  action: PlayerJoinLeaveAction
}

export interface RehydrateEvent {
  players: Player[]
}

export interface ChatEvent {
  player: Player
  message: string
}

export interface DrawEvent {
  player: Player
  line: Line
}

export interface GameEvent {
  type: EventType
  data: unknown
}
