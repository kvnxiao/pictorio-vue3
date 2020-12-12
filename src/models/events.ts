import { Line } from "./drawing"
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

export interface RehydrateEvent {
  user: User
}

export interface UserJoinLeaveEvent {
  user: User
  action: UserJoinLeaveAction
}

export interface ChatEvent {
  user: User
  message: string
}

export interface DrawEvent {
  user: User
  line: Line
}

export interface GameEvent {
  type: EventType
  data: unknown
}
