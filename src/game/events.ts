import { GameEvent, GameEventTypeMap } from "@/models/events"
import { Ref, watch } from "vue"

function isGameEvent(data: unknown): data is GameEvent {
  return typeof data === "object" && (data as GameEvent).type !== undefined
}

export function useEventListener(wsData: Ref<unknown>) {
  const listen = <T extends keyof GameEventTypeMap>(
    type: T,
    callback: (event: GameEventTypeMap[T]) => void,
  ): void => {
    watch(wsData, (wsData: unknown) => {
      if (isGameEvent(wsData) && wsData.type === type) {
        const event = wsData.data
        callback(event as GameEventTypeMap[T])
      }
    })
  }

  return {
    listen,
  }
}
