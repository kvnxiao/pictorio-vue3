import { COLOURS, Line, Point, THICKNESSES, midPoint } from "@/models/drawing"
import { Ref, onMounted, ref, unref } from "vue"

export interface DualLayerCanvas {
  drawTemp: (p1: Point, p2: Point, scale: number, colourIdx: number, thicknessIdx: number) => void
  drawMain: (line: Line, scale: number) => void
  clearTemp: () => void
  clearMain: () => void
  resize: (width: number, height: number) => void
}

export function useDualLayerCanvasContext(
  canvasRef: Ref<HTMLCanvasElement | null>,
  topCanvasRef: Ref<HTMLCanvasElement | null>,
): DualLayerCanvas {
  const ctxRef: Ref<CanvasRenderingContext2D | null> = ref(null)
  const topCtxRef: Ref<CanvasRenderingContext2D | null> = ref(null)

  const drawTemp = (
    p1: Point,
    p2: Point,
    scale: number,
    colourIdx: number,
    thicknessIdx: number,
  ) => {
    const topCtx = unref(topCtxRef)
    if (topCtx) {
      topCtx.lineJoin = "round"
      topCtx.lineCap = "round"
      topCtx.strokeStyle = COLOURS[colourIdx]
      topCtx.lineWidth = THICKNESSES[thicknessIdx] * scale
      topCtx.beginPath()
      topCtx.moveTo(p1.x * scale, p1.y * scale)
      topCtx.lineTo(p2.x * scale, p2.y * scale)
      topCtx.stroke()
    }
  }

  const drawMain = (line: Line, scale: number) => {
    const ctx = unref(ctxRef)
    if (line.points.length > 0 && ctx) {
      ctx.lineJoin = "round"
      ctx.lineCap = "round"
      ctx.strokeStyle = COLOURS[line.colourIdx]
      ctx.lineWidth = THICKNESSES[line.thicknessIdx] * scale
      ctx.beginPath()
      ctx.moveTo(line.points[0].x * scale, line.points[0].y * scale)

      for (let i = 0; i < line.points.length - 1; i++) {
        const p1 = line.points[i]
        const p2 = line.points[i + 1]
        const mid = midPoint(p1, p2)
        ctx.quadraticCurveTo(p1.x * scale, p1.y * scale, mid.x * scale, mid.y * scale)
      }

      ctx.stroke()
    }
  }

  const clearTemp = () => {
    const topCtx = unref(topCtxRef)
    topCtx && topCtx.clearRect(0, 0, topCtx.canvas.width, topCtx.canvas.height)
  }

  const clearMain = () => {
    const ctx = unref(ctxRef)
    ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  const resize = (width: number, height: number) => {
    const canvas = unref(canvasRef)
    const topCanvas = unref(topCanvasRef)
    if (canvas && topCanvas) {
      // Resize canvas
      canvas.width = width
      canvas.height = height
      topCanvas.width = width
      topCanvas.height = height
    }
  }

  onMounted(() => {
    const ctx = canvasRef.value?.getContext("2d")
    const topCtx = topCanvasRef.value?.getContext("2d")
    if (ctx && topCtx) {
      ctxRef.value = ctx
      topCtxRef.value = topCtx
    }
  })

  return {
    drawTemp,
    drawMain,
    clearTemp,
    clearMain,
    resize,
  }
}
