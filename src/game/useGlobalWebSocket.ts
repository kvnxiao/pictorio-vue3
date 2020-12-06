import { ComputedRef, Ref, computed, reactive, toRefs } from "vue"
import { READY_STATE_MAPPING, WebSocketState } from "./websocket"
import { GameEvent } from "@/models/events"
import { emitEvent } from "./events"

interface GlobalWebSocketState {
  data: unknown
  error: Event | null
}

export interface GlobalWebSocket {
  data: Ref<unknown>
  error: Ref<Event | null>
  state: ComputedRef<WebSocketState>
  close(code?: number, reason?: string): void
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
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

function close(code?: number, reason?: string): void {
  ws?.close(code, reason)
}

function send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
  ws?.send(data)
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
      console.error(err)
    }
  }
}

export function useGlobalWebSocket(): GlobalWebSocket {
  return {
    ...toRefs(globalWebSocketState),
    state,
    close,
    send,
    connect,
  }
}
