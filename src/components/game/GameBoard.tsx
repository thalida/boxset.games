import { Text, type TextProps, StyleSheet, Platform, View, Button } from 'react-native';
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

  const nodesRef = useRef<{ [key: string]: View | null }>({});
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { px1: number, py1: number, px2: number, py2: number } }>({});

  function handleReset() {
    setGame(gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  }

  const activeNode = useSharedValue<INode | null>(null);
  const linePos = useSharedValue<{x1: number, y1: number, x2: number, y2: number}>({x1: 0, y1: 0, x2: 0, y2: 0});
  const activeNodePath = useSharedValue<Array<INode>>([]);
  const animatedLineProps = useAnimatedProps(() => {
    return {
      x1: linePos.value.x1,
      y1: linePos.value.y1,
      x2: linePos.value.x2,
      y2: linePos.value.y2,
    };
  });
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [selectedPath, setSelectedPath] = useState<Array<INode>>([]);


  function handleOnLayout() {
    for (const [key, node] of Object.entries(nodesRef.current)) {
      if (node) {
        node.measure((x, y, width, height, pageX, pageY) => {
          setNodePositions((prev) => ({
            ...prev,
            [key]: {
              px1: pageX - (NODE_PADDING / 2),
              py1: pageY - (NODE_PADDING / 2),
              px2: pageX + width + (NODE_PADDING / 2),
              py2: pageY + height + (NODE_PADDING / 2),
            },
          }));
        });
      }
    }
  }

  function findNearestNode(pos: INodeCoords): INode | null {
    "worklet";

    let nearestNodeCoords: INodeCoords | null = null;

    for (const [key, { px1, py1, px2, py2 }] of Object.entries(nodePositions)) {
      if (pos.x >= px1 && pos.x <= px2 && pos.y >= py1 && pos.y <= py2) {
        const nodeCoords = key.split(",").map((n) => parseInt(n, 10));
        nearestNodeCoords = { x: nodeCoords[0], y: nodeCoords[1] };
        break;
      }
    }

    return nearestNodeCoords ? game.board[nearestNodeCoords.y][nearestNodeCoords.x] : null;
  }

  useAnimatedReaction(() => activeNode.value, (value, prevValue) => {
    if(value === prevValue) {
      return;
    }

    runOnJS(setSelectedNode)(value);
  });

  useAnimatedReaction(() => activeNodePath.value, (value, prevValue) => {
    runOnJS(setSelectedPath)(value);
  });


  const tapGesture = Gesture.Tap()
    .onStart((e) => {
      // const foundNode = {x: -1, y: -1};
      // const pos = { x: e.absoluteX, y: e.absoluteY };

      // for (const [key, { px1, py1, px2, py2 }] of Object.entries(nodePositions)) {
      //   if (pos.x >= px1 && pos.x <= px2 && pos.y >= py1 && pos.y <= py2) {
      //     foundNode.x = parseInt(key.split(",")[0]);
      //     foundNode.y = parseInt(key.split(",")[1]);
      //     break;
      //   }
      // }

      // runOnJS(setactiveNode)(foundNode);
    });

  const dragGesture = Gesture.Pan()
    .minDistance(10)
    .minPointers(1)
    .averageTouches(true)
    .onStart((e) => {
      const nearestNode = findNearestNode({ x: e.absoluteX, y: e.absoluteY });

      if (nearestNode === null) {
        activeNode.value = null;
        return;
      }

      const lastMove = activeNodePath.value[activeNodePath.value.length - 1];
      const isSameNode = gameUtils.isSameNode(nearestNode, lastMove);

      console.log("isSameNode", isSameNode);

      if (isSameNode) {
        activeNodePath.value.pop();
        activeNode.value = activeNodePath.value[activeNodePath.value.length - 1] || null;
        return;
      }

      const isValidMove = gameUtils.isValidMove(game.puzzle, activeNodePath.value, nearestNode);
      console.log("isValidMove", isValidMove, activeNodePath.value, nearestNode);

      if (!isValidMove) {
        activeNode.value = null;
        return;
      }

      activeNode.value = nearestNode;
      activeNodePath.value.push(nearestNode);

      const nodePos = nodePositions[`${activeNode.value.x},${activeNode.value.y}`];

      linePos.value = {
        x1: (nodePos.px1 + nodePos.px2) / 2,
        y1: (nodePos.py1 + nodePos.py2) / 2,
        x2: (nodePos.px1 + nodePos.px2) / 2,
        y2: (nodePos.py1 + nodePos.py2) / 2,
      };
    })
    .onUpdate((e) => {
      if (!activeNode.value) {
        linePos.value = {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
        };
        return;
      }

      // Draw line
      const nodePos = nodePositions[`${activeNode.value.x},${activeNode.value.y}`];
      linePos.value = {
        x1: (nodePos.px1 + nodePos.px2) / 2,
        y1: (nodePos.py1 + nodePos.py2) / 2,
        x2: e.absoluteX,
        y2: e.absoluteY,
      };

      const nearestNode = findNearestNode({ x: e.absoluteX, y: e.absoluteY });
      if (nearestNode === null) {
        return;
      }

      const isValidMove = gameUtils.isValidMove(game.puzzle, activeNodePath.value, nearestNode);
      if (!isValidMove) {
        return;
      }

      activeNode.value = nearestNode;
      activeNodePath.value.push(nearestNode);
    })
    .onEnd(() => {
      linePos.value = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      };
    });

  const gestures = Gesture.Exclusive(dragGesture);

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: "#1B2036"
      }}
    >
      {/* Line */}
      <Svg style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}>
        <AnimatedSVGLine
          animatedProps={animatedLineProps}
          x1={linePos.value.x1}
          y1={linePos.value.y1}
          x2={linePos.value.x2}
          y2={linePos.value.y2}
          stroke="white"
          strokeWidth={4}
        />
      </Svg>
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
        height: "100%",
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
                      state={gameUtils.isNodeInPath(selectedPath, node) ? NodeState.Connected : NodeState.Default}
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
      </SafeAreaView>
    </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({});
