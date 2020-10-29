import { Ref, onMounted, onUnmounted, reactive, toRefs } from "vue"

export enum InputEvent {
  MOVE = 0,
  CLICK = 1,
  RELEASE = 2,
}

interface InputCoordinates {
  button: number
  eventType: InputEvent
  isTargetCanvas: boolean
  x: number
  y: number
}

export interface InputCoordinateRefs {
  x: Ref<number>
  y: Ref<number>
  button: Ref<number>
  eventType: Ref<InputEvent>
  isTargetCanvas: Ref<boolean>
}

export function useInputCoordinates(
  topCanvasRef: Ref<HTMLElement | null>,
  canvasRef: Ref<HTMLElement | null>,
): InputCoordinateRefs {
  const body = document.body as HTMLBodyElement
  const coordinates: InputCoordinates = reactive({
    button: 0,
    eventType: InputEvent.MOVE,
    isTargetCanvas: false,
    x: 0,
    y: 0,
  })

  const setMouseCoordinates = (type: InputEvent) => (
    event: MouseEvent | TouchEvent,
  ) => {
    const topCanvas = topCanvasRef.value
    const canvas = canvasRef.value
    if (topCanvas === null || canvas === null) {
      return
    }

    const x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
    const y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
    const button = event instanceof MouseEvent ? event.button : 0
    const boundingRect = topCanvas.getBoundingClientRect()
    const isTargetCanvas = event.target === topCanvas || event.target === canvas
    if (isTargetCanvas && button === 0) {
      event.preventDefault()
    }
    coordinates.x = x - boundingRect.left
    coordinates.y = y - boundingRect.top
    coordinates.eventType = type
    coordinates.button = button
    coordinates.isTargetCanvas = isTargetCanvas
  }

  const moveFunc = setMouseCoordinates(InputEvent.MOVE)
  const clickFunc = setMouseCoordinates(InputEvent.CLICK)
  const releaseFunc = setMouseCoordinates(InputEvent.RELEASE)

  onMounted(() => {
    body.addEventListener("mousemove", moveFunc)
    body.addEventListener("mousedown", clickFunc)
    body.addEventListener("mouseup", releaseFunc)
  })

  onUnmounted(() => {
    body.removeEventListener("mousemove", moveFunc)
    body.removeEventListener("mousedown", clickFunc)
    body.removeEventListener("mouseup", releaseFunc)
  })

  return toRefs(coordinates)
}
