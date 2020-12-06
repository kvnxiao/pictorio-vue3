export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export const READY_STATE_MAPPING: WebSocketState[] = [
  WebSocketState.CONNECTING,
  WebSocketState.OPEN,
  WebSocketState.CLOSING,
  WebSocketState.CLOSED,
]
