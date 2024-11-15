import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';
import ShapeConnector from '@/games/shapeconnector';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <ShapeConnector />
    </ThemeProvider>
  );
}
