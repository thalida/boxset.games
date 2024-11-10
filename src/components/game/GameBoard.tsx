import { Text, type TextProps, StyleSheet, Platform, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '../ThemedView';
import { Shape } from './Shape';
import { IGame, ShapeColor, ShapeType } from './enums';
import * as gameUtils from './utils';
import { useMemo, useState } from 'react';

export type GameBoardProps = {};

export function GameBoard(props: GameBoardProps) {
  const [game, setGame] = useState<IGame>(() => gameUtils.generateGame(8, 8));
  const startNode = useMemo(() => game.puzzle[0], [game.puzzle]);
  const endNode = useMemo(() => game.puzzle[game.puzzle.length - 1], [game.puzzle]);

  function handleReset() {
    setGame(gameUtils.generateGame(8, 8));
  }

  return (
      <ThemedView style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
        <SafeAreaView>

          <Button title="Reset" onPress={handleReset} />

          <View style={{ flexDirection: "row", gap: 4 }}>
            {startNode && (
              <Shape
                state="default"
                type={startNode.shape}
                color={startNode.color}
                size={32}
              />
            )}

            {endNode && (
              <Shape
                state="default"
                type={endNode.shape}
                color={endNode.color}
                size={32}
              />
            )}
          </View>

          <View style={{ flexDirection: "row", marginBottom: 32, gap: 4 }}>
            {game.puzzle.map((node, i) => (
              <View key={i} style={{ flexDirection: "column" }}>
                <Shape
                  state="default"
                  type={node.shape}
                  color={node.color}
                  size={32}
                />
                <Text>{node.x}, {node.y}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "column", gap: 12, margin: 12 }}>
            {game.board.map((row, y) => (
              <View key={y} style={{ flexDirection: "row", gap: 12 }}>
                {row.map((node, x) => (
                  <Shape
                    key={x}
                    state="default"
                    type={node.shape}
                    color={node.color}
                    size={32}
                  />
                ))}
              </View>
            ))}
          </View>

        </SafeAreaView>
      </ThemedView>
    );
}

const styles = StyleSheet.create({});
