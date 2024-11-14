import { Text, type TextProps, StyleSheet, Platform, View, Button, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedView } from '../ThemedView';
import { Shape } from './Shape';
import { IGame, INode, INodeCoords, NodeState, ShapeColor, ShapeType } from './enums';
import * as gameUtils from './utils';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Animated, { runOnJS, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

export type GameBoardProps = {};

const AnimatedSVGLine = Animated.createAnimatedComponent(Line);

export function GameBoard(props: GameBoardProps) {
  const safeAreaInsets = useSafeAreaInsets();

  const BOARD_SIZE = 8;
  const PATH_SIZE = 16;
  const NODE_SIZE = 28;
  const NODE_PADDING = 16;

  const [game, setGame] = useState<IGame>(() => gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  const startNode = useMemo(() => game.puzzle[0], [game.puzzle]);
  const endNode = useMemo(() => game.puzzle[game.puzzle.length - 1], [game.puzzle]);

  const [path, setPath] = useState<Array<INode>>([]);

  function handleReset() {
    setGame(gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  }

  function handleNodePress(node: INode) {
    const isNodeInPath = gameUtils.isNodeInPath(path, node);

    if (isNodeInPath) {
      const nodeIndex = path.findIndex((p) => p.x === node.x && p.y === node.y);
      setPath(path.slice(0, nodeIndex));
      return;
    }

    const isValidMove = gameUtils.isValidMove(game.puzzle, path, node);

    if (!isValidMove) {
      return;
    }

    setPath([...path, node]);
  }

  function getNodeState(node: INode) {
    const isNodeInPath = gameUtils.isNodeInPath(path, node);
    const isLastSelected = gameUtils.isSameNode(path[path.length - 1], node);

    if (isLastSelected) {
      return NodeState.Selected;
    }

    if (isNodeInPath) {
      return NodeState.Connected
    }

    return NodeState.Default;
  }

  return (
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#1B2036"
      }}>
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
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            marginHorizontal: "auto",
          }}
        >
          {game.board.map((row, y) => (
            <View
            key={y}
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              gap: 0,
            }}>
              {row.map((node, x) => (
                <View
                  key={`${x},${y}`}
                  style={{
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                    <Pressable onPress={() => handleNodePress(node)}>
                      <Shape
                        state={getNodeState(node)}
                        type={node.shape}
                        color={node.color}
                        size={NODE_SIZE}
                      />
                    </Pressable>
                    {x < row.length - 1 && (
                      <View style={{
                        width: NODE_PADDING,
                        height: 4,
                        backgroundColor: "#000",
                        borderRadius: 2,
                      }} />
                    )}
                  </View>
                  {y < game.board.length - 1 && (
                    <View style={{
                      width: 4,
                      height: NODE_PADDING,
                      backgroundColor: "#000",
                      borderRadius: 2,
                      marginLeft: NODE_SIZE / 2 - 2,
                    }} /> )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
