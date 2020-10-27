import { onMounted, onUnmounted, reactive, Ref, ToRefs, toRefs } from "vue"

export enum MouseEventType {
  MOVE = 0,
  CLICK = 1,
  RELEASE = 2,
}

export interface MouseCoordinates {
  x: number
  y: number
  type: MouseEventType
  isTargetCanvas: boolean
}

export function useDrawingCoordinates(
  topCanvas: Ref<HTMLElement | null>,
  canvas: Ref<HTMLElement | null>,
): ToRefs<MouseCoordinates> {
  const body = document.body as HTMLBodyElement
  const coords: MouseCoordinates = reactive({
    x: 0,
    y: 0,
    type: MouseEventType.MOVE,
    isTargetCanvas: false,
  })

  const setMouseCoordinates = (type: MouseEventType) => (event: MouseEvent | TouchEvent) => {
    if (topCanvas.value === null || canvas.value === null) {
      return
    }

    const x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
    const y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
    const boundingRect = topCanvas.value.getBoundingClientRect()
    coords.x = x - boundingRect.left
    coords.y = y - boundingRect.top
    coords.type = type

    const targetted = event.target === topCanvas.value || event.target === canvas.value
    if (targetted) {
      event.preventDefault()
    }
    coords.isTargetCanvas = targetted
  }

  const moveFunc = setMouseCoordinates(MouseEventType.MOVE)
  const clickFunc = setMouseCoordinates(MouseEventType.CLICK)
  const releaseFunc = setMouseCoordinates(MouseEventType.RELEASE)

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

  return toRefs(coords)
}
