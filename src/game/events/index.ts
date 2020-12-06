import { EventType, GameEventTypeMap } from "@/models/events"
import { EventEmitter } from "events"

const globalEmitter = new EventEmitter()

export function onEvent<T extends keyof GameEventTypeMap>(
  eventType: T,
  listener: (event: GameEventTypeMap[T]) => void,
): void {
  globalEmitter.on(eventType, listener)
}

export function emitEvent(eventType: EventType, eventData: unknown): void {
  globalEmitter.emit(eventType, eventData)
}
