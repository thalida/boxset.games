import { Text, type TextProps, StyleSheet, Platform, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '../ThemedView';
import { Shape } from './Shape';
import { IGame, NodeState, ShapeColor, ShapeType } from './enums';
import * as gameUtils from './utils';
import { useMemo, useState } from 'react';

export type GameBoardProps = {};

export function GameBoard(props: GameBoardProps) {
  const [game, setGame] = useState<IGame>(() => gameUtils.generateGame(8, 16));
  const startNode = useMemo(() => game.puzzle[0], [game.puzzle]);
  const endNode = useMemo(() => game.puzzle[game.puzzle.length - 1], [game.puzzle]);

  function handleReset() {
    setGame(gameUtils.generateGame(8, 16));
  }

  return (
      <ThemedView style={{ flex: 1, height: "100%", backgroundColor: "#1B2036" }}>
        <SafeAreaView>

          <Button title="Reset" onPress={handleReset} />

          <View style={{ flexDirection: "row", gap: 4 }}>
            {startNode && (
              <Shape
                state={NodeState.Selected}
                type={startNode.shape}
                color={startNode.color}
                size={32}
              />
            )}

            <Text>
                {game.puzzle.length - 2}
            </Text>

            {endNode && (
              <Shape
                state={NodeState.Selected}
                type={endNode.shape}
                color={endNode.color}
                size={32}
              />
            )}
          </View>

          <View style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginHorizontal: "auto",
            }}>
            {game.board.map((row, y) => (
              <View
              key={y}
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                gap: 12,
              }}>
                {row.map((node, x) => (
                  <Shape
                    key={`${x},${y}`}
                    state={NodeState.Default}
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
