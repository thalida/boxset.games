import { IGame, IGameMetadata } from "@/types";
import { Play } from "./Play";

const metadata: IGameMetadata =  {
  key: "tictactoecubed",
  name: "TicTacToeCubed",
  description: "A 9x9 TicTacToe game",
  modes: {
    singlePlayer: true,
    multiPlayerLocal: true,
    multiPlayerOnline: true,
    mulitPlayerBot: true,
  },
  levels: null,
  botLevels: [
    {
      key: "beginner",
      label: "Beginner",
      description: "Easy",
    },
    {
      key: "intermediate",
      label: "Intermediate",
      description: "Medium",
    },
    {
      key: "expert",
      label: "Expert",
      description: "Hard",
    },
  ],
};

const game: IGame = {
  metadata,
  Play,
};

export default  game;
