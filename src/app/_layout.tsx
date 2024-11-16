import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { View, Text } from 'react-native';
import { AvailableGames, AvailableGamesOrder } from "@/games";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#1B2036',
    }}>

      {AvailableGamesOrder.map((gameKey) => (
        <View>
          <Text style={{ color: "#fff" }}>{AvailableGames[gameKey].metadata.name}</Text>
          <Text style={{ color: "#fff" }}>{AvailableGames[gameKey].metadata.description}</Text>
        </View>
      ))}

    </SafeAreaView>
  );
}
