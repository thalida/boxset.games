import { Text, type TextProps, StyleSheet, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Shape } from './Shape';

export type GameBoardProps = {};

export function GameBoard(props: GameBoardProps) {

  return (
      <ThemedView style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
        <SafeAreaView>
          <Shape state="default" type="triangle" color="red" size={32} />
          <Shape state="default" type="cross" color="yellow" size={32} />
          <Shape state="default" type="circle" color="green" size={32} />
          <Shape state="default" type="square" color="blue" size={32} />
        </SafeAreaView>
      </ThemedView>
    );
}

const styles = StyleSheet.create({});
