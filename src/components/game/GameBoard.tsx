import { Text, type TextProps, StyleSheet, Platform, View, Button } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedView } from '../ThemedView';
import { Shape } from './Shape';
import { IGame, NodeState, ShapeColor, ShapeType } from './enums';
import * as gameUtils from './utils';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

export type GameBoardProps = {};

export function GameBoard(props: GameBoardProps) {
  const safeAreaInsets = useSafeAreaInsets();

  const BOARD_SIZE = 8;
  const PATH_SIZE = 16;
  const NODE_SIZE = 32;
  const NODE_PADDING = 12;

  const [game, setGame] = useState<IGame>(() => gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  const startNode = useMemo(() => game.puzzle[0], [game.puzzle]);
  const endNode = useMemo(() => game.puzzle[game.puzzle.length - 1], [game.puzzle]);

  const nodesRef = useRef<{ [key: string]: View | null }>({});
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { px1: number, py1: number, px2: number, py2: number } }>({});

  function handleReset() {
    setGame(gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  }

  const [selectedNode, setSelectedNode] = useState<{ x: number, y: number }>({ x: -1, y: -1 });
  const [linePos, setLinePos] = useState<{x1: number, y1: number, x2: number, y2: number}>({x1: 0, y1: 0, x2: 0, y2: 0});


  function handleOnLayout() {
    console.log("Layout");

    for (const [key, node] of Object.entries(nodesRef.current)) {
      if (node) {
        node.measure((x, y, width, height, pageX, pageY) => {
          setNodePositions((prev) => ({
            ...prev,
            [key]: {
              px1: pageX,
              py1: pageY,
              px2: pageX + width,
              py2: pageY + height,
            },
          }));
        });
      }
    }
  }

  const tapGesture = Gesture.Tap()
    .onStart((e) => {
      const foundNode = {x: -1, y: -1};
      const pos = { x: e.absoluteX, y: e.absoluteY };

      for (const [key, { px1, py1, px2, py2 }] of Object.entries(nodePositions)) {
        if (pos.x >= px1 && pos.x <= px2 && pos.y >= py1 && pos.y <= py2) {
          foundNode.x = parseInt(key.split(",")[0]);
          foundNode.y = parseInt(key.split(",")[1]);
          break;
        }
      }

      runOnJS(setSelectedNode)(foundNode);
    });

  const dragGesture = Gesture.Pan()
    .minDistance(10)
    .minPointers(1)
    .averageTouches(true)
    .onStart((e) => {
      const nodePos = nodePositions[`${selectedNode.x},${selectedNode.y}`];

      runOnJS(setLinePos)({
        x1: (nodePos.px1 + nodePos.px2) / 2,
        y1: (nodePos.py1 + nodePos.py2) / 2,
        x2: (nodePos.px1 + nodePos.px2) / 2,
        y2: (nodePos.py1 + nodePos.py2) / 2,
      });
    })
    .onUpdate((e) => {
      const nodePos = nodePositions[`${selectedNode.x},${selectedNode.y}`];

      runOnJS(setLinePos)({
        x1: (nodePos.px1 + nodePos.px2) / 2,
        y1: (nodePos.py1 + nodePos.py2) / 2,
        x2: e.absoluteX,
        y2: e.absoluteY,
      });

      console.log(linePos);
    })
    .onEnd(() => {
      runOnJS(setLinePos)({
        x1: -1,
        y1: -1,
        x2: -1,
        y2: -1,
      });
    });

  const gestures = Gesture.Exclusive(tapGesture, dragGesture);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1, height: "100%", backgroundColor: "#1B2036" }}>
          <SafeAreaView>

            <Button title="Reset" onPress={handleReset} />

            <View style={{ flexDirection: "row", gap: 4 }}>
              {startNode && (
                <Shape
                  state={NodeState.Selected}
                  type={startNode.shape}
                  color={startNode.color}
                  size={NODE_SIZE}
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
                  size={NODE_SIZE}
                />
              )}
            </View>

            {/* Game Board */}
            <GestureDetector gesture={gestures}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: NODE_PADDING,
                  marginHorizontal: "auto",
                }}
                onLayout={handleOnLayout}
              >
                {game.board.map((row, y) => (
                  <View
                  key={y}
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    gap: NODE_PADDING,
                  }}>
                    {row.map((node, x) => (
                      <View
                        key={`${x},${y}`}
                        ref={(el) => {
                          nodesRef.current[`${x},${y}`] = el;
                        }}
                      >
                        <Shape
                          state={selectedNode.x === x && selectedNode.y === y ? NodeState.Selected : NodeState.Default}
                          type={node.shape}
                          color={node.color}
                          size={NODE_SIZE}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </GestureDetector>

            {/* Line */}
            <Svg style={{
              position: "absolute",
              top: 0,
              left: 0,
              // backgroundColor: "red",
            }}>
              <Line
                x1={linePos.x1}
                y1={linePos.y1}
                x2={linePos.x2}
                y2={linePos.y2}
                stroke="white"
                strokeWidth={4}
              />
            </Svg>

          </SafeAreaView>
        </ThemedView>
    </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({});
