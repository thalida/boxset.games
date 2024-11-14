import { Text, type TextProps, StyleSheet, Platform, View, Button, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Shape } from './Shape';
import { IGame, INode, INodeCoords } from './types';
import { NodeState, ShapeColor, ShapeType } from './constants';
import * as gameUtils from './utils';
import React, { useMemo, useRef, useState } from 'react';

export type GameBoardProps = {};


export function GameBoard(props: GameBoardProps) {
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
      const isLastNode = nodeIndex === path.length - 1;
      const goBackTo = isLastNode ? nodeIndex : nodeIndex + 1;
      setPath(path.slice(0, goBackTo));
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

  function getNodeLineStyle(node1: INode, node2: INode) {
    const node1Index = gameUtils.nodePathIndex(path, node1);
    const node2Index = gameUtils.nodePathIndex(path, node2);

    const foundNodes = node1Index !== -1 && node2Index !== -1;
    const isAdjacent = Math.abs(node1Index - node2Index) === 1;

    return foundNodes && isAdjacent ? {opacity: 1} : {opacity: 0};
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
                    alignItems: "flex-start",
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
                      <LinearGradient
                        colors={[node.color, row[x + 1].color]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{
                          width: NODE_PADDING,
                          height: 4,
                          borderRadius: 2,
                          ...getNodeLineStyle(node, row[x + 1]),
                        }}
                      />
                    )}
                  </View>
                  {y < game.board.length - 1 && (
                    <LinearGradient
                      colors={[node.color, game.board[y + 1][x].color]}
                      style={{
                        width: 4,
                        height: NODE_PADDING,
                        borderRadius: 2,
                        marginLeft: NODE_SIZE / 2 - 2,
                        ...getNodeLineStyle(node, game.board[y + 1][x]),
                      }}
                    />
                    )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
