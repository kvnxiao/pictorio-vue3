export const BASE_URL = `${window.location.protocol}//${window.location.host}`

export const FLASH_MESSAGE = `${BASE_URL}/api/flash`

export const CREATE_ROOM = `${BASE_URL}/api/create`
export const ROOM = (roomID: string): string => `/room/${roomID}`
