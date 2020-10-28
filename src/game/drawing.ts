import { computed, ComputedRef, toRef, watch } from "vue"
import { DrawingState } from "./drawingState"

function midPoint(p1: Point, p2: Point): Point {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}

export const THICKNESS = ["SMALL", "MEDIUM", "LARGE"]
export const THICKNESS_MULTIPLIER = 10

export const COLOURS = [
  "#808080",
  "#000000",
  "#FFFFFF",
  "#F0192B",
  "#35CB08",
  "#0100FB",
  "#A9C6FF",
  "#EFEC07",
  "#F3941E",
  "#652C93",
  "#ECB5EE",
  "#DAAD84",
  "#633712",
]

export interface Point {
  x: number
  y: number
}

export interface Line {
  pts: Point[]
  colour: number
  size: number
}

export interface Drawing {
  clear(): void
  undo(): void
  redo(): void
  destroy(): void
  resizeCanvas(width: number, height: number): void
  onPencilMove(x: number, y: number): void
  onPencilDown(x: number, y: number): void
  onPencilUp(x: number, y: number): void
}

export class CanvasDrawing implements Drawing {
  // Bottom canvas
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  // Top canvas (for temporary lines)
  private readonly topCanvas: HTMLCanvasElement
  private readonly topCtx: CanvasRenderingContext2D

  private readonly maxWidth: number

  private isDrawing = false

  private state: DrawingState
  private size: ComputedRef<number>

  private redoStack: Line[] = []

  public constructor(
    canvas: HTMLCanvasElement,
    topCanvas: HTMLCanvasElement,
    maxWidth: number,
    drawingState: DrawingState,
  ) {
    // Setup canvas and 2D canvas context
    this.canvas = canvas
    this.topCanvas = topCanvas
    this.maxWidth = maxWidth
    const ctx = this.canvas.getContext("2d")
    if (ctx === null) {
      throw "Could not get 2D context of canvas"
    }
    const topCtx = this.topCanvas.getContext("2d")
    if (topCtx === null) {
      throw "Could not get 2D context of top-canvas"
    }
    this.ctx = ctx
    this.topCtx = topCtx

    // Set up state and watchers for state changes
    this.state = drawingState
    this.size = computed(() => (this.state.sizeIdx + 1) * 10)
    this.ctx.strokeStyle = COLOURS[this.state.colourIdx]
    this.topCtx.strokeStyle = COLOURS[this.state.colourIdx]

    watch(this.size, size => {
      this.ctx.lineWidth = size
      this.topCtx.lineWidth = size
    })
    watch(toRef(this.state, "colourIdx"), colourIdx => {
      this.ctx.strokeStyle = COLOURS[colourIdx]
      this.topCtx.strokeStyle = COLOURS[colourIdx]
    })
  }

  public destroy() {
    this.state.lines.length = 0
    this.state.points.length = 0
    this.redoStack.length = 0
  }

  public resizeCanvas(width: number, height: number) {
    // resize canvas
    this.canvas.width = width
    this.canvas.height = height
    this.topCanvas.width = width
    this.topCanvas.height = height
    this.state.scale = this.canvas.width / this.maxWidth

    // re-hydrate canvas context
    this.ctx.lineWidth = this.size.value * this.state.scale
    this.ctx.lineJoin = "round"
    this.ctx.lineCap = "round"
    this.topCtx.lineWidth = this.ctx.lineWidth
    this.topCtx.lineJoin = this.ctx.lineJoin
    this.topCtx.lineCap = this.ctx.lineCap

    // redraw lines with newly resized scale
    this.redraw()
  }

  public undo() {
    const line = this.state.lines.pop()
    if (line) {
      this.redoStack.push(line)
      this.clearMainCanvas()
      this.redraw()
    }
  }

  public redo() {
    const line = this.redoStack.pop()
    if (line) {
      this.state.lines.push(line)
      this.clearMainCanvas()
      this.redraw()
    }
  }

  public clear() {
    this.state.lines.splice(0, this.state.lines.length)
    this.redoStack.splice(0, this.redoStack.length)
    this.clearMainCanvas()
  }

  public onPencilMove(x: number, y: number) {
    if (this.isDrawing) {
      this.state.points.push(this.scaledPoint(x, y))
      // draw temporary line on top canvas
      this.drawTempLine()
    }
  }

  public onPencilDown(x: number, y: number) {
    this.isDrawing = true
    this.state.points.push(this.scaledPoint(x, y))
  }

  public onPencilUp(x: number, y: number) {
    if (this.isDrawing) {
      this.isDrawing = false
      this.redoStack.splice(0, this.redoStack.length) // clear redo-stack since a new line was created

      this.state.points.push(this.scaledPoint(x, y))

      // draw line on bottom layer canvas, then add line to list of points
      const line: Line = {
        pts: this.state.points,
        colour: this.state.colourIdx,
        size: this.size.value,
      }

      this.drawLineQuadratic(line)
      this.state.lines.push(line)
      this.state.points = []

      this.clearTempCanvas()
    }
  }

  private clearMainCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  private clearTempCanvas() {
    this.topCtx.clearRect(0, 0, this.topCtx.canvas.width, this.topCtx.canvas.height)
  }

  private drawLineQuadratic(line: Line) {
    if (line.pts.length) {
      this.ctx.strokeStyle = COLOURS[line.colour]
      this.ctx.lineWidth = line.size * this.state.scale
      this.ctx.beginPath()
      this.ctx.moveTo(line.pts[0].x * this.state.scale, line.pts[0].y * this.state.scale)

      for (let i = 0; i < line.pts.length - 1; i++) {
        const p1 = line.pts[i]
        const p2 = line.pts[i + 1]
        const mid = midPoint(p1, p2)
        this.ctx.quadraticCurveTo(
          p1.x * this.state.scale,
          p1.y * this.state.scale,
          mid.x * this.state.scale,
          mid.y * this.state.scale,
        )
      }

      this.ctx.stroke()
    }
  }

  private drawTempLine() {
    const latestPoint = this.state.points[this.state.points.length - 1]
    const prevLatestPoint = this.state.points[this.state.points.length - 2]
    this.topCtx.beginPath()
    this.topCtx.moveTo(prevLatestPoint.x * this.state.scale, prevLatestPoint.y * this.state.scale)
    this.topCtx.lineTo(latestPoint.x * this.state.scale, latestPoint.y * this.state.scale)
    this.topCtx.stroke()
  }

  private redraw() {
    for (const line of this.state.lines) {
      this.drawLineQuadratic(line)
    }
  }

  private scaledPoint(x: number, y: number): Point {
    return {
      x: x / this.state.scale,
      y: y / this.state.scale,
    }
  }
}
