import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GameMode } from '@/games/shapeconnector/core/constants';

export default function Page() {
  const { mode: modeParam } = useLocalSearchParams();
  const mode = useMemo(() => {
    const values = Object.values(GameMode) as string[];

    if (modeParam?.length === 0 || Array.isArray(modeParam) || !values.includes(modeParam)) {
      return GameMode.EASY;
    }

    return modeParam as GameMode;
  }, [modeParam]);


  return (
    <View>
        <Text>Tic Tac Toe Cubed</Text>
    </View>
  );
}
