import { ComputedRef, Ref, computed, reactive, toRefs } from "vue"
import { EventType, GameEvent, GameEventTypeMap } from "@/models/events"
import { READY_STATE_MAPPING, WebSocketState } from "./websocket"
import { emitEvent } from "../events"

interface GlobalWebSocketState {
  data: unknown
  error: Event | null
}

export interface GlobalWebSocket {
  data: Ref<unknown>
  error: Ref<Event | null>
  state: ComputedRef<WebSocketState>
  disconnect(code?: number, reason?: string): void
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
  sendEvent(eventType: EventType, eventData: GameEventTypeMap[EventType]): void
  connect(
    url: string,
    onOpen?: (event: Event) => void,
    onClose?: (event: CloseEvent) => void,
  ): void
}

let ws: WebSocket | null = null

const globalWebSocketState: GlobalWebSocketState = reactive({
  data: null,
  error: null,
})

const state: ComputedRef<WebSocketState> = computed(
  () => READY_STATE_MAPPING[ws?.readyState ?? 0],
)

const disconnect = (code?: number, reason?: string) => {
  ws?.close(code, reason)
}

const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
  ws?.send(data)
}

const sendEvent = <T extends keyof GameEventTypeMap>(
  eventType: T,
  eventData: GameEventTypeMap[T],
) => {
  const gameEvent: GameEvent = {
    type: eventType,
    data: eventData,
  }
  ws?.send(JSON.stringify(gameEvent))
}

function isGameEvent(data: unknown): data is GameEvent {
  return typeof data === "object" && (data as GameEvent).type !== undefined
}

const connect = (
  url: string,
  onOpen?: (event: Event) => void,
  onClose?: (event: CloseEvent) => void,
) => {
  if (ws) {
    if (state.value !== WebSocketState.CLOSED) {
      return
    }
    ws = null
  }

  ws = new WebSocket(url)
  if (onOpen) ws.onopen = onOpen
  if (onClose) ws.onclose = onClose

  ws.onerror = (event: Event) => {
    globalWebSocketState.error = event
  }

  ws.onmessage = (event: MessageEvent) => {
    try {
      const wsData = JSON.parse(event.data)
      if (isGameEvent(wsData)) {
        emitEvent(wsData.type, wsData.data)
      }
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }
  }
}

export function useGlobalWebSocket(): GlobalWebSocket {
  return {
    ...toRefs(globalWebSocketState),
    state,
    connect,
    send,
    sendEvent,
    disconnect,
  }
}
