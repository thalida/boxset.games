import { Direction, IGame, INode, INodeCoords, IPuzzle, ShapeColor, ShapeType, TBoard, TFlatBoard, TPuzzle } from "./enums";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

function getRandomFromList<T>(list: Array<T>): T {
  return list[getRandomNumber(0, list.length - 1)];
}

function getRandomColor(exclude?: ShapeColor[]): ShapeColor {
  let colors = [ShapeColor.Red, ShapeColor.Green, ShapeColor.Blue, ShapeColor.Yellow];

  if (exclude) {
    colors = colors.filter((c) => !exclude.includes(c));
  }

  return colors[getRandomNumber(0, colors.length - 1)];
}

function getRandomShape(exclude?: ShapeType[]): ShapeType {
  let shapes = [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle, ShapeType.Cross];

  if (exclude) {
    shapes = shapes.filter((s) => !exclude.includes(s));
  }

  return shapes[getRandomNumber(0, shapes.length - 1)];
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
    const node = { x: getRandomNumber(0, boardSize - 1), y: getRandomNumber(0, boardSize - 1) };
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

  const nextNode = getRandomFromList(validMoves);
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
      const keepColor = getRandomBoolean();
      color = keepColor ? color : getRandomColor(excludeColors);
      shape = !keepColor ? shape : getRandomShape(excludeShapes);
    }

    puzzle.push({
      x: coords[i].x,
      y: coords[i].y,
      color,
      shape,
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
