import { View, Text, Button } from "react-native";
import { GameModes } from "../constants";

export interface IModeSelectorProps {
  onLevelSelected: (mode: GameModes) => void;
};

export function ModeSelector(props: IModeSelectorProps) {

  return (
    <View>
      <Text>Level Select</Text>
      <Text>Choose a level:</Text>
      <View>
        {Object.values(GameModes).map((mode) => (
          <Button key={mode} title={mode} onPress={() => props.onLevelSelected(mode)} />
        ))}
      </View>
    </View>
  );
}
