import ShapeConnector from './shapeconnector';
import TicTacToeCubed from './tictactoecubed';

export default {
  ShapeConnector,
  TicTacToeCubed,
}

export const AvailableGames = {
  [ShapeConnector.key]: ShapeConnector,
  [TicTacToeCubed.key]: TicTacToeCubed,
}

export const AvailableGamesOrder = [
  ShapeConnector.key,
  TicTacToeCubed.key,
]
