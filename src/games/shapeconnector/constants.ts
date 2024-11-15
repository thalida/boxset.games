export enum ShapeType {
  Circle = "circle",
  Square = "square",
  Triangle = "triangle",
  Cross = "cross",
}

export enum ShapeColor {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Yellow = "yellow",
}

export enum Direction {
  Up = "+y",
  Down = "-y",
  Left = "-x",
  Right = "+x",
}

export enum NodeState {
  Default = "default",
  Selected = "selected",
  Connected = "connected",
  Faded = "faded",
}

export const UI_COLORS = {
  "background": "#1B2036",
  "text": "#FFFFFF",
  "selected": "#FFFBDB",
  "error": "#FF0000",
}
export const SHAPE_COLORS = {
  [ShapeColor.Red]: "#D40004",
  [ShapeColor.Green]: "#00D400",
  [ShapeColor.Blue]: "#006AD4",
  [ShapeColor.Yellow]: "#D4AA00",
};
