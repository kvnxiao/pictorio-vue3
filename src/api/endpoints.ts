export const BASE_URL = `${window.location.protocol}//${window.location.host}`
export const BASE_WS_URL = `${process.env.VUE_APP_WS_PROTOCOL}://${window.location.host}`

export const USER_NAME = `/api/uname`

export const ROOM_CREATE = `/api/room/create`
export const ROOM_EXISTS = `/api/room/exists`
export const ROOM_WS = (roomID: string): string =>
  `${BASE_WS_URL}/api/room/${roomID}/ws`
export const ROOM_REDIRECT = (roomID: string): string => `/room/${roomID}`
