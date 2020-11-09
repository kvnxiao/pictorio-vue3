export type FlashMessageType = "error" | "info" | "warning"

export interface FlashMessage {
  message: string
  type: FlashMessageType
}
