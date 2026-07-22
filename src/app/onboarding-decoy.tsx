/**
 * Onboarding, Phase 2 ("Setup") — step 4 of 5 — optional decoy mode setup.
 *
 * Off by default, no preset persona — see DecoyEditor for the actual
 * editing logic, shared verbatim with Settings. Skip and Continue lead to
 * the exact same place (the final screen); this step is entirely optional
 * and there's nothing to "complete" here beyond what the person chooses
 * to fill in.
 */
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DecoyEditor } from '@/components/DecoyEditor';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

export default function OnboardingDecoyScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const goNext = () => router.push('/onboarding-ready');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} onSkip={goNext} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            Disguise eva (optional)
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            If you turn this on, the × on Home swaps eva for a plain screen
            you design — your own label, icon, and color, not a pre-built
            theme. Off by default.
          </Text>
        </View>

        <DecoyEditor />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={goNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
  copy: {
    gap: Spacing.md,
  },
  headline: {
    textAlign: 'center',
  },
  subtext: {
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
