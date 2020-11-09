export const BASE_URL = `${window.location.protocol}//${window.location.hostname}`

export const CREATE_ROOM = `${BASE_URL}/create`
export const ROOM = (roomID: string): string => `/room/${roomID}`
