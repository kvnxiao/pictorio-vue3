import { ComputedRef, Ref, computed, ref } from "vue"

export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

const READY_STATE_MAPPING: WebSocketState[] = [
  WebSocketState.CONNECTING,
  WebSocketState.OPEN,
  WebSocketState.CLOSING,
  WebSocketState.CLOSED,
]

let ws: WebSocket | null = null

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

export function useGlobalWebSocket(): GlobalWebSocket {
  const data: Ref<unknown> = ref(null)
  const error: Ref<Event | null> = ref(null)
  const state: ComputedRef<WebSocketState> = computed(
    () => READY_STATE_MAPPING[ws?.readyState ?? 0],
  )

  const close = (code?: number, reason?: string) => {
    ws?.close(code, reason)
  }

  const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    ws?.send(data)
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
      error.value = event
    }

    ws.onmessage = (event: MessageEvent) => {
      data.value = event.data
    }
  }

  return {
    data,
    error,
    state,
    close,
    send,
    connect,
  }
}
