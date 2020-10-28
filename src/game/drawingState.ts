import { reactive } from "vue"
import { Line, Point } from "./drawing"

export interface DrawingState {
  sizeIdx: number
  colourIdx: number
  points: Point[]
  lines: Line[]
  scale: number
}

// Global drawing state
const drawingState: DrawingState = reactive({
  sizeIdx: 0,
  colourIdx: 1,
  points: [],
  lines: [],
  scale: 1,
})

export function useDrawingState() {
  return {
    drawingState,
  }
}
