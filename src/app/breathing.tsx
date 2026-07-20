/**
 * Breathing screen — a grounding tool reachable straight from Home.
 *
 * Zero distractions is the whole design brief: no settings, no contact
 * list, nothing but a back arrow. Someone using this screen is trying to
 * regulate their nervous system, and every extra element is a chance to
 * pull their attention away from the one thing that's actually helping.
 *
 * The 5-4-3-2-1 grounding list below the animation is static and doesn't
 * require the breathing pace to be followed exactly — it's there as an
 * alternative or supplement for anyone who finds naming sensory details
 * more grounding than watching a circle.
 */
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BreathingCircle } from '@/components/BreathingCircle';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

const GROUNDING_STEPS = [
  '5 things you can see',
  '4 things you can touch',
  '3 things you can hear',
  '2 things you can smell',
  '1 thing you can taste',
];

export default function BreathingScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.backButton}
      >
        <Text style={[styles.backArrow, { color: colors.textPrimary }]}>←</Text>
      </Pressable>

      <View style={styles.content}>
        <BreathingCircle />

        <View style={styles.grounding}>
          {GROUNDING_STEPS.map((step) => (
            <Text key={step} style={[Typography.body, { color: colors.textSecondary }]}>
              {step}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  backArrow: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  grounding: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
