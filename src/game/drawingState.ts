import { Line, Point } from "@/models/drawing"
import { reactive } from "vue"

export interface DrawingState {
  isDrawing: boolean
  colourIdx: number
  thicknessIdx: number
  points: Point[]
  lines: Line[]
  scale: number
}

// Global drawing state
const drawingState: DrawingState = reactive({
  isDrawing: false,
  colourIdx: 0,
  thicknessIdx: 0,
  points: [],
  lines: [],
  scale: 1,
})

export function useDrawingState() {
  function recentTwoPoints(): Point[] {
    const lastIndex = drawingState.points.length - 1
    return [drawingState.points[lastIndex - 1], drawingState.points[lastIndex]]
  }
  function getLine(): Line {
    return {
      points: drawingState.points,
      colourIdx: drawingState.colourIdx,
      thicknessIdx: drawingState.thicknessIdx,
    }
  }
  return {
    drawingState,
    recentTwoPoints,
    getLine,
  }
}
