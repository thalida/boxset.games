export interface IGame {
  metadata: IGameMetadata;
  Play:  (props: IPlayComponentProps) => React.JSX.Element;
}

export interface IGameMetadata {
  key: string;
  name: string;
  description: string;
  modes: {
    singlePlayer: boolean;
    multiPlayerLocal: boolean;
    multiPlayerOnline: boolean;
    mulitPlayerBot: boolean;
  };
  levels: IGameLevel[] | null;
  botLevels: IGameLevel[] | null;
}

export interface IGameLevel {
  key: string;
  label: string;
  description: string;
}

export interface IPlayComponentProps {
  mode: string | null;
  level: string | null;
  botLevel: string | null;
}
