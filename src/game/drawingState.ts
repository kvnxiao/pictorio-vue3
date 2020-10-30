import { Line, Point } from "@/models/drawing"
import { Ref, reactive, toRef } from "vue"

interface DrawingState {
  isDrawing: boolean
  colourIdx: number
  thicknessIdx: number
  points: Point[]
  lines: Line[]
  scale: number
  redoStack: Line[]
}

export interface DrawingStateRefs {
  isDrawing: Ref<boolean>
  colourIdx: Ref<number>
  thicknessIdx: Ref<number>
  points: Ref<Point[]>
  lines: Ref<Line[]>
  scale: Ref<number>
  redoStack: Ref<Line[]>
  getLatestLine: () => Line
  getLatestTwoPoints: () => Point[]
}

// Global drawing state
const drawingState: DrawingState = reactive({
  isDrawing: false,
  colourIdx: 0,
  thicknessIdx: 0,
  points: [],
  lines: [],
  scale: 1,
  redoStack: [],
})

export function useGlobalDrawingState(): DrawingStateRefs {
  const isDrawing = toRef(drawingState, "isDrawing")
  const colourIdx = toRef(drawingState, "colourIdx")
  const thicknessIdx = toRef(drawingState, "thicknessIdx")
  const points = toRef(drawingState, "points")
  const lines = toRef(drawingState, "lines")
  const scale = toRef(drawingState, "scale")
  const redoStack = toRef(drawingState, "redoStack")

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
    redoStack,
    getLatestLine,
    getLatestTwoPoints,
  }
}
