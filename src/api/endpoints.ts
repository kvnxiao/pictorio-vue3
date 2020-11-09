export const BASE_URL = `${window.location.protocol}//${window.location.host}`

export const CREATE_ROOM = `${BASE_URL}/create`
export const ROOM = (roomID: string): string => `/room/${roomID}`
