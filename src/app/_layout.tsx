import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { View, Text } from 'react-native';
import { AvailableGames, AvailableGamesOrder } from "@/games";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#111',
    }}>

      {AvailableGamesOrder.map((gameKey) => (
        <View>
          <Text>{AvailableGames[gameKey].metadata.name}</Text>
          <Text>{AvailableGames[gameKey].metadata.description}</Text>
        </View>
      ))}

    </SafeAreaView>
  );
}
