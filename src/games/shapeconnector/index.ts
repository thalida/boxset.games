import { IGame, IGameMetadata } from "@/types";
import { Play } from "./Play";
import { GAME_SETTINGS, GameDifficulty } from "./core/constants";

const metadata: IGameMetadata =  {
  name: "Shape Connector",
  description: "Solve the puzzle by connecting the shapes",
  modes: {
    singlePlayer: true,
    multiPlayerLocal: false,
    multiPlayerOnline: false,
    mulitPlayerBot: false,
  },
  levels: [
    {
      key: GameDifficulty.EASY,
      label: "Easy",
      description: `${GAME_SETTINGS[GameDifficulty.EASY].boardSize}x${GAME_SETTINGS[GameDifficulty.EASY].boardSize}`,
    },
    {
      key: GameDifficulty.MEDIUM,
      label: "Medium",
      description: `${GAME_SETTINGS[GameDifficulty.MEDIUM].boardSize}x${GAME_SETTINGS[GameDifficulty.MEDIUM].boardSize}`,
    },
    {
      key: GameDifficulty.HARD,
      label: "Hard",
      description: `${GAME_SETTINGS[GameDifficulty.HARD].boardSize}x${GAME_SETTINGS[GameDifficulty.HARD].boardSize}`,
    },
  ],
  botLevels: null,
};

const game: IGame = {
  key: "shapeconnector",
  metadata,
  Play,
};

export default  game;
