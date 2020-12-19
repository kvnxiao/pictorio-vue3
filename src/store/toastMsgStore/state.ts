import { ToastMessage } from "@/models/toastMessage"

export interface ToastMessageState {
  message: ToastMessage | null
}

export const state: ToastMessageState = {
  message: null,
}
