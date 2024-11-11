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
}

export interface IGame {
  board: TBoard;
  puzzle: INode[];
}

export type TBoard = Array<Array<INode>>;
export type TPuzzle = Array<INode>;

export interface INodeCoords {
  x: number;
  y: number;
}

export interface INode extends INodeCoords {
  shape: ShapeType;
  color: ShapeColor;
}
