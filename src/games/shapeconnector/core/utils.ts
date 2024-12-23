import { IGame, INode, INodeCoords, TBoard, TPuzzle } from "./types";
import { GAME_SETTINGS, GameDifficulty, NodeState, SHAPE_COLORS, ShapeColor, ShapeType } from "./constants";
import * as utils from "@/utils";

function getRandomColor(exclude?: ShapeColor[]): ShapeColor {
  let colors = [ShapeColor.Red, ShapeColor.Green, ShapeColor.Blue, ShapeColor.Yellow];

  if (exclude) {
    colors = colors.filter((c) => !exclude.includes(c));
  }

  return colors[utils.getRandomNumber(0, colors.length - 1)];
}

function getRandomShape(exclude?: ShapeType[]): ShapeType {
  let shapes = [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle, ShapeType.Cross];

  if (exclude) {
    shapes = shapes.filter((s) => !exclude.includes(s));
  }

  return shapes[utils.getRandomNumber(0, shapes.length - 1)];
}


function generatePuzzleCoords(
  boardSize: number,
  pathSize: number,
  path: Array<INodeCoords>,
  visited: Array<INodeCoords>,
): Array<INodeCoords> {
  if (path.length === pathSize) {
    return path;
  }

  const parentNode = path[path.length - 1];

  if (typeof parentNode === 'undefined') {
    const node = { x: utils.getRandomNumber(0, boardSize - 1), y: utils.getRandomNumber(0, boardSize - 1) };
    path.push(node);
    visited.push(node);
    return generatePuzzleCoords(boardSize, pathSize, path, visited);
  }

  const potentialMoves = [
    { x: parentNode.x + 1, y: parentNode.y },
    { x: parentNode.x - 1, y: parentNode.y },
    { x: parentNode.x, y: parentNode.y + 1 },
    { x: parentNode.x, y: parentNode.y - 1 },
  ];

  const validMoves = potentialMoves.filter((move) => {
    return move.x >= 0 && move.x < boardSize && move.y >= 0 && move.y < boardSize && !visited.find((v) => v.x === move.x && v.y === move.y);
  });

  if (validMoves.length === 0) {
    return generatePuzzleCoords(boardSize, pathSize, path.slice(0, -1), visited);
  }

  const nextNode = utils.getRandomFromList(validMoves);
  path.push(nextNode);
  visited.push(nextNode);

  return generatePuzzleCoords(boardSize, pathSize, path, visited);
}


function generatePuzzle(boardSize: number, pathSize: number): TPuzzle {
  const coords = generatePuzzleCoords(boardSize, pathSize, [], []);
  const puzzle: TPuzzle = [];

  const MAX_SAME_CHAIN = 3;

  for (let i = 0; i < coords.length; i+=1) {
    if (i === 0) {
      puzzle.push({
        x: coords[i].x,
        y: coords[i].y,
        color: getRandomColor(),
        shape: getRandomShape(),
        state: NodeState.Default,
      });
      continue;
    }

    const lastNNodes = puzzle.slice(-MAX_SAME_CHAIN);
    const sameColor = lastNNodes.every((n) => n.color === lastNNodes[0].color);
    const sameShape = lastNNodes.every((n) => n.shape === lastNNodes[0].shape);

    const lastColor = puzzle[i - 1].color;
    const lastShape = puzzle[i - 1].shape;

    const excludeColors = [lastColor];
    const excludeShapes = [lastShape];

    let color = lastColor;
    let shape = lastShape;

    if (i === pathSize - 1) {
      excludeColors.push(puzzle[0].color);
      excludeShapes.push(puzzle[0].shape);
    }

    if (sameColor) {
      color = getRandomColor(excludeColors);
    } else if (sameShape) {
      shape = getRandomShape(excludeShapes);
    } else {
      const keepColor = utils.getRandomBoolean();
      color = keepColor ? color : getRandomColor(excludeColors);
      shape = !keepColor ? shape : getRandomShape(excludeShapes);
    }

    puzzle.push({
      x: coords[i].x,
      y: coords[i].y,
      color,
      shape,
      state: NodeState.Default,
    });
  }

  return puzzle;
}

export function generateBoard(boardSize: number, puzzle: TPuzzle): TBoard {
  const board: Array<INode[]> = [];

  for (let y = 0; y < boardSize; y+=1) {
    const row: INode[] = [];
    for (let x = 0; x < boardSize; x+=1) {
      const puzzleNode = puzzle.find((p) => p.x === x && p.y === y);
      const node = puzzleNode ? puzzleNode :  {
        x,
        y,
        color: getRandomColor(),
        shape: getRandomShape(),
        state: NodeState.Default,
      }
      row.push(node);
    }

    board.push(row);
  }

  return board
}


export function generateGame(boardSize: number, pathSize: number): IGame {
  const puzzle = generatePuzzle(boardSize, pathSize);
  const board = generateBoard(boardSize, puzzle);

  return {
    board,
    puzzle,
  };
}

export function isValidMove(puzzle: TPuzzle, path: Array<INode>, move: INode) {
  "worklet";

  if (path.length === puzzle.length) {
    return false;
  }

  if (path.length === 0) {
    return move.shape === puzzle[0].shape && move.color === puzzle[0].color;
  }

  const lastNode = path[path.length - 1];

  const hasMatchingProp = move.shape === lastNode.shape || move.color === lastNode.color;
  const isNotVisited = !path.find((p) => p.x === move.x && p.y === move.y);
  const isNeighbour = Math.abs(move.x - lastNode.x) + Math.abs(move.y - lastNode.y) === 1;

  return hasMatchingProp && isNotVisited && isNeighbour;
}

export function isMatchingNode(node1: INode, node2: INode) {
  if (!node1 || !node2) {
    return false;
  }

  return node1.shape === node2.shape && node1.color === node2.color;
}

export function isSameNode(node1: INode, node2: INode) {
  if (!node1 || !node2) {
    return false;
  }

  return node1.x === node2.x && node1.y === node2.y;
}

export function isNodeInPath(path: Array<INode>, node: INode) {
  return !!path.find((p) => isSameNode(p, node));
}

export function nodePathIndex(path: Array<INode>, node: INode) {
  return path.findIndex((p) => isSameNode(p, node));
}

export function getNodeDisplayColor(node: INode) {
  return SHAPE_COLORS[node.color];
}

export function getGameSettings(mode: GameDifficulty) {
  return GAME_SETTINGS[mode] || GAME_SETTINGS[GameDifficulty.EASY];
}
