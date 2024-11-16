import { useMemo } from 'react';
import { IPlayComponentProps } from '@/types';
import { Game } from './components/Game';
import { GameDifficulty } from './core/constants';

export function Play(props: IPlayComponentProps) {
  const difficultyOptions = Object.values(GameDifficulty) as string[];

  const difficulty = useMemo(() => {
    if (
      typeof props.level !== 'string'
      || props.level?.length === 0
      || Array.isArray(props.level)
      || !difficultyOptions.includes(props.level)
  ) {
      return GameDifficulty.EASY;
    }

    return props.level as GameDifficulty;
  }, [props.level]);

  return (
    <Game difficulty={difficulty} />
  );
}
