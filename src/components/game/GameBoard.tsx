import { Text, type TextProps, StyleSheet, Platform, View, Button, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiPressable } from 'moti/interactions'

import { Shape } from './Shape';
import { IGame, INode, INodeCoords } from './types';
import { NodeState, ShapeColor, ShapeType } from './constants';
import * as gameUtils from './utils';
import React, { useMemo, useRef, useState } from 'react';

export type GameBoardProps = {};


export function GameBoard(props: GameBoardProps) {
  const BOARD_SIZE = 8;
  const PATH_SIZE = 8;
  const NODE_SIZE = 28;
  const NODE_PADDING = 16;

  const [game, setGame] = useState<IGame>(() => gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  const startNode = useMemo(() => game.puzzle[0], [game.puzzle]);
  const endNode = useMemo(() => game.puzzle[game.puzzle.length - 1], [game.puzzle]);

  const [path, setPath] = useState<INode[]>([]);
  const numRemainingMoves = useMemo(() => {
    return path.length > 0 ? game.puzzle.length - path.length : game.puzzle.length - 1;
  }, [game.puzzle, path]);

  function handleReset() {
    setPath([]);
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

    return foundNodes && isAdjacent ?  { opacity: 1 } : { opacity: 0 };
  }

  return (
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#1B2036"
      }}>
        <Button title="Reset" onPress={handleReset} />

        {/* { game.puzzle.map((node, index) => (
            <Shape
              state={NodeState.Default}
              type={node.shape}
              color={node.color}
              size={NODE_SIZE}
            />
      ))} */}

        <View style={{ flexDirection: "row", gap: 4 }}>
          {startNode && (
            <Shape
              state={NodeState.Selected}
              type={startNode.shape}
              color={startNode.color}
              size={NODE_SIZE}
            />
          )}

          <Text style={{ color: "#fff" }}>
              {numRemainingMoves}
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
                    <MotiPressable
                      onPress={() => handleNodePress(node)}
                      animate={
                        useMemo(() =>  ({ hovered, pressed }: { hovered: boolean, pressed: boolean}) => {
                          'worklet'
                          return {
                            scale: hovered || pressed ? 0.5 : 1,
                          }
                        }, [])
                     }
                     transition={{
                        scale: { type: 'spring', damping: 5, stiffness: 100, }
                      }}
                    >
                      <Shape
                        state={getNodeState(node)}
                        type={node.shape}
                        color={node.color}
                        size={NODE_SIZE}
                      />
                    </MotiPressable>
                    {x < row.length - 1 && (
                      <LinearGradient
                        colors={[gameUtils.getNodeDisplayColor(node), gameUtils.getNodeDisplayColor(row[x + 1])]}
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
                      colors={[gameUtils.getNodeDisplayColor(node), gameUtils.getNodeDisplayColor(game.board[y + 1][x])]}
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
