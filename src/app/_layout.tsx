import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { View, Text, Dimensions } from 'react-native';
import { AvailableGames } from "@/games";
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel, {
  ICarouselInstance,
} from "react-native-reanimated-carousel";
import { useRef } from 'react';

export default function RootLayout() {
  const ref = useRef<ICarouselInstance>(null);
  const width = Dimensions.get("window").width;

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#1B2036',
    }}>
      <Carousel
        ref={ref}
        width={width}
        height={width / 2}
        data={AvailableGames}
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>{AvailableGames[index].metadata.name}</Text>
            <Text style={{ color: "#fff" }}>{AvailableGames[index].metadata.description}</Text>
          </View>
        )}
      />

    </SafeAreaView>
  );
}
