export const BASE_URL = `${window.location.protocol}//${window.location.host}`
export const BASE_WS_URL = `ws://${window.location.host}`

export const FLASH_MESSAGE = `/api/flash`

export const CREATE_ROOM = `/api/create`
export const ROOM = (roomID: string): string => `/room/${roomID}`
