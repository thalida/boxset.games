import { IGame, IGameMetadata } from "@/types";
import { Play } from "./Play";

const metadata: IGameMetadata =  {
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
  key: "tictactoecubed",
  metadata,
  Play,
};

export default  game;
