import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Image, Platform } from 'react-native';

export default function Page() {
  return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText>Welcome!</ThemedText>
      </ThemedView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
