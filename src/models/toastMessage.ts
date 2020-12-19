export type ToastMessageType = "error" | "info" | "warning"

export interface ToastMessage {
  message: string
  type: ToastMessageType
}
