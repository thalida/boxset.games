import { NodeState, ShapeColor, ShapeType } from "./constants";

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
  state: NodeState;
}
