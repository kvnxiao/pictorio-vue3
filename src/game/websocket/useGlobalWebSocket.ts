import { ComputedRef, Ref, computed, reactive, toRefs } from "vue"
import { READY_STATE_MAPPING, WebSocketState } from "./websocket"

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
  connect(
    url: string,
    onOpen?: (event: Event) => void,
    onClose?: (event: CloseEvent) => void,
    onMessage?: (event: MessageEvent) => void,
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

const connect = (
  url: string,
  onOpen?: (event: Event) => void,
  onClose?: (event: CloseEvent) => void,
  onMessage?: (event: MessageEvent) => void,
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
  if (onMessage) ws.onmessage = onMessage

  ws.onerror = (event: Event) => {
    globalWebSocketState.error = event
  }
}

export function useGlobalWebSocket(): GlobalWebSocket {
  return {
    ...toRefs(globalWebSocketState),
    state,
    connect,
    send,
    disconnect,
  }
}
