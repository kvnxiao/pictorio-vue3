export enum Thickness {
  SMALL = 10,
  MEDIUM = 20,
  LARGE = 30,
}

export const THICKNESSES: Thickness[] = [Thickness.SMALL, Thickness.MEDIUM, Thickness.LARGE]

export enum Colours {
  BLACK = "#000000",
  GREY = "#808080",
  WHITE = "#FFFFFF",
  RED = "#F0192B",
  GREEN = "#35CB08",
  BLUE = "#0100FB",
  AZURE = "#A9C6FF",
  YELLOW = "#EFEC07",
  ORANGE = "#F3941E",
  PURPLE = "#642C93",
  PINK = "#ECB5EE",
  TAN = "#DAAD84",
  BROWN = "#633712",
}

export const COLOURS: Colours[] = [
  Colours.BLACK,
  Colours.GREY,
  Colours.WHITE,
  Colours.RED,
  Colours.GREEN,
  Colours.BLUE,
  Colours.AZURE,
  Colours.YELLOW,
  Colours.ORANGE,
  Colours.PURPLE,
  Colours.PINK,
  Colours.TAN,
  Colours.BROWN,
]

export interface Point {
  x: number
  y: number
}

export interface Line {
  points: Point[]
  colourIdx: number
  thicknessIdx: number
}

export function scaledPoint(x: number, y: number, scale: number): Point {
  return {
    x: x / scale,
    y: y / scale,
  }
}

export function midPoint(p1: Point, p2: Point): Point {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}
