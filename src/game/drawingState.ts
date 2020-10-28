import { Line, Point } from "@/models/drawing"
import { reactive, toRef } from "vue"

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

export function useGlobalDrawingState() {
  const isDrawing = toRef(drawingState, "isDrawing")
  const colourIdx = toRef(drawingState, "colourIdx")
  const thicknessIdx = toRef(drawingState, "thicknessIdx")
  const points = toRef(drawingState, "points")
  const lines = toRef(drawingState, "lines")
  const scale = toRef(drawingState, "scale")

  const getLatestTwoPoints = (): Point[] => {
    const lastIndex = drawingState.points.length - 1
    return [drawingState.points[lastIndex - 1], drawingState.points[lastIndex]]
  }

  const getLatestLine = (): Line => {
    return {
      points: drawingState.points,
      colourIdx: drawingState.colourIdx,
      thicknessIdx: drawingState.thicknessIdx,
    }
  }

  return {
    isDrawing,
    colourIdx,
    thicknessIdx,
    points,
    lines,
    scale,
    getLatestLine,
    getLatestTwoPoints,
  }
}
