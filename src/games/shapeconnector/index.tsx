import { useState } from "react";
import { GameBoard } from "./components/GameBoard";
import { ModeSelector } from "./components/ModeSelector";
import { IGameSettings } from "./types";
import { GAME_SETTINGS, GameModes } from "./constants";

export default function RootLayout() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<IGameSettings | null>(null);

  function handleLevelSelected(mode: GameModes) {
    const levelSettings = GAME_SETTINGS[mode];

    if (typeof levelSettings === "undefined" || levelSettings === null) {
      setIsPlaying(false);
      setSettings(null);
      return;
    }

    setSettings(levelSettings);
    setIsPlaying(true);
  }


  return (
    <>
      {isPlaying && settings ? <GameBoard settings={settings} /> : <ModeSelector onLevelSelected={handleLevelSelected} />}
    </>
  );

}
