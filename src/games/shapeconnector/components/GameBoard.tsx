import { Text, type TextProps, StyleSheet, Platform, View, Button, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MotiPressable } from 'moti/interactions'
import { StarIcon, XMarkIcon } from "react-native-heroicons/solid";

import { Shape } from './Shape';
import { IGame, INode } from '../types';
import { NodeState, UI_COLORS } from '../constants';
import * as gameUtils from '../utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export type GameBoardProps = {};


export function GameBoard(props: GameBoardProps) {
  const BOARD_SIZE = 8;
  const PATH_SIZE = 2;
  const NODE_SIZE = 28;
  const NODE_PADDING = 16;

  const [game, setGame] = useState<IGame>(() => gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  const [path, setPath] = useState<INode[]>([]);

  const [goodMoveSound] = useState<Audio.Sound>(new Audio.Sound());
  const [badMoveSound] = useState<Audio.Sound>(new Audio.Sound());
  const [undoMoveSound] = useState<Audio.Sound>(new Audio.Sound());
  const [winSound] = useState<Audio.Sound>(new Audio.Sound());
  const [loseSound] = useState<Audio.Sound>(new Audio.Sound());

  const startNode = useMemo(() => game.puzzle[0], [game.puzzle]);
  const endNode = useMemo(() => game.puzzle[game.puzzle.length - 1], [game.puzzle]);

  const numRemainingMoves = useMemo(() => {
    return path.length > 0 ? game.puzzle.length - path.length : game.puzzle.length - 1;
  }, [game.puzzle, path]);

  const numRemainingMovesGradient = useMemo(() => {
     return path.length > 1 ? (path.length - 1) / (game.puzzle.length - 1) : 0;
  }, [game.puzzle, path]);

  const isPuzzleSolved = useMemo(() => {
    const isStartSame = gameUtils.isMatchingNode(path[0], startNode);
    const isEndSame = gameUtils.isMatchingNode(path[path.length - 1], endNode);
    const isSameLength = path.length === game.puzzle.length;
    return isStartSame && isEndSame && isSameLength;
  }, [startNode, endNode, path, game.puzzle]);


  useEffect(() => {
    async function loadSounds() {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      goodMoveSound.loadAsync(require('../assets/sounds/good-move.mp3'));
      badMoveSound.loadAsync(require('../assets/sounds/bad-move.mp3'));
      undoMoveSound.loadAsync(require('../assets/sounds/undo-move.mp3'));
      winSound.loadAsync(require('../assets/sounds/win.mp3'));
      loseSound.loadAsync(require('../assets/sounds/lose.mp3'));
    }

    loadSounds();

    return () => {
      goodMoveSound?.unloadAsync();
      badMoveSound?.unloadAsync();
      undoMoveSound?.unloadAsync();
      winSound?.unloadAsync();
      loseSound?.unloadAsync();
    }
  }, []);

  useEffect(() => {
    if (!isPuzzleSolved && numRemainingMoves > 0) {
      return;
    }

    if (!isPuzzleSolved && numRemainingMoves === 0) {
      playSound(loseSound);
      return;
    }

    playSound(winSound);
  }, [isPuzzleSolved, numRemainingMoves]);

  function handleReset() {
    setPath([]);
    setGame(gameUtils.generateGame(BOARD_SIZE, PATH_SIZE));
  }

  function handleNodePress(node: INode) {
    if (isPuzzleSolved) {
      return;
    }

    const isNodeInPath = gameUtils.isNodeInPath(path, node);

    if (isNodeInPath) {
      const nodeIndex = path.findIndex((p) => p.x === node.x && p.y === node.y);
      const isLastNode = nodeIndex === path.length - 1;
      const goBackTo = isLastNode ? nodeIndex : nodeIndex + 1;
      setPath(path.slice(0, goBackTo));
      playSound(undoMoveSound);
      return;
    }

    const isValidMove = gameUtils.isValidMove(game.puzzle, path, node);

    if (!isValidMove) {
      playSound(badMoveSound);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      return;
    }

    setPath([...path, node]);
    playSound(goodMoveSound);
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
  }

  function getStartNodeState() {
    if (isPuzzleSolved) {
      return NodeState.Selected;
    }

    const hasStartNode = gameUtils.isMatchingNode(path[0], startNode);
    if (!hasStartNode) {
      return NodeState.Default;
    }

    return path.length > 1 ? NodeState.Connected : NodeState.Selected;
  }

  function getMoveCountBorder() {
    if (path.length === 0) {
      return UI_COLORS.text;
    }

    if (path.length == 1) {
      return "rgba(200, 200, 200, 0.8)";
    }

    if (!isPuzzleSolved && numRemainingMoves === 0) {
      return UI_COLORS.error;
    }

    return UI_COLORS.selected;
  }

  function getNodeState(node: INode) {
    const isNodeInPath = gameUtils.isNodeInPath(path, node);
    const isLastSelected = gameUtils.isSameNode(path[path.length - 1], node);

    if (isPuzzleSolved) {
      return isNodeInPath ? NodeState.Selected : NodeState.Faded;
    }

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

  async function playSound(sound: Audio.Sound | null | undefined) {
    if (!sound) {
      return;
    }

    try {
      await sound.replayAsync();
    } catch (error) {
      console.error(error);
    }
  }

  return (
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: UI_COLORS.background,
        justifyContent: "space-between",
      }}>
        <View style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}>
          {startNode && endNode && (
            <View style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
              <Shape
                state={getStartNodeState()}
                type={startNode.shape}
                color={startNode.color}
                size={NODE_SIZE}
              />

              <LinearGradient
                colors={[gameUtils.getNodeDisplayColor(startNode), "#fff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y:  0}}
                style={{
                  width: NODE_PADDING / 2,
                  height: 4,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 2,
                }}
              />

              <LinearGradient
                colors={[gameUtils.getNodeDisplayColor(startNode), gameUtils.getNodeDisplayColor(endNode), UI_COLORS.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y:  0}}
                locations={[0, numRemainingMovesGradient, numRemainingMovesGradient]}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: NODE_SIZE + 8,
                  height: NODE_SIZE + 8,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: getMoveCountBorder(),
                  borderStyle: "solid",
                }}
              >
                <View style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  width: "100%",
                  height: "100%",
                }}>
                  {!isPuzzleSolved && numRemainingMoves > 0 && (
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                      {numRemainingMoves}
                    </Text>
                  )}
                  {!isPuzzleSolved && numRemainingMoves === 0 && (
                    <XMarkIcon color={UI_COLORS.error} size={18} />
                  )}
                  {isPuzzleSolved && (
                    <StarIcon color="#fff" size={18} />
                  )}
                </View>
              </LinearGradient>

              <LinearGradient
                colors={["#fff", gameUtils.getNodeDisplayColor(endNode)]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y:  0 }}
                style={{
                  width: NODE_PADDING / 2,
                  height: 4,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 2,
                  borderBottomRightRadius: 2,
                  borderBottomLeftRadius: 0,
                }}
              />
              <Shape
                state={isPuzzleSolved ? NodeState.Selected : path.length === game.puzzle.length && gameUtils.isMatchingNode(path[path.length - 1], endNode) ? NodeState.Connected : NodeState.Default}
                type={endNode.shape}
                color={endNode.color}
                size={NODE_SIZE}
              />
            </View>
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
                            scale: !isPuzzleSolved && (hovered || pressed) ? 0.5 : 1,
                          }
                        }, [isPuzzleSolved])
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
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          width: NODE_PADDING,
                          height: 4,
                          borderRadius: 4,
                          ...getNodeLineStyle(node, row[x + 1]),
                        }}
                      />
                    )}
                  </View>
                  {y < game.board.length - 1 && (
                    <LinearGradient
                      colors={[gameUtils.getNodeDisplayColor(node), gameUtils.getNodeDisplayColor(game.board[y + 1][x])]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{
                        width: 4,
                        height: NODE_PADDING,
                        borderRadius: 4,
                        marginLeft: (NODE_SIZE / 2) - 2,
                        ...getNodeLineStyle(node, game.board[y + 1][x]),
                      }}
                    />
                    )}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View>
          <Button title="Reset" onPress={handleReset} />
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
