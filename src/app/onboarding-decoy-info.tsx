/**
 * Onboarding, Phase 1 ("Understanding EVA") — step 6 of 6 — the concept of
 * disguising eva entirely, the last Phase 1 screen before Phase 2 begins.
 *
 * Concept only — turning the disguise on and choosing its label, icon, and
 * color happens later, in Phase 2 (see onboarding-decoy.tsx), and it's off
 * by default. What matters here is knowing, before it's ever turned on,
 * that the disguise doesn't cut eva off: both ways back are explained so
 * neither has to be discovered by accident under pressure later.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

export default function OnboardingDecoyInfoScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            eva can disguise itself, too
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            Turn this on later and eva can look like a plain notes app
            instead — nothing about it hints at what’s underneath. Three
            quick taps in the bottom-left corner bring eva back whenever
            you’re ready. Holding that same spot for 3 seconds — same as
            the panic button — sends the alert right away, without ever
            revealing eva first.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={() => router.push('/onboarding-setup-prompt')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  copy: {
    alignItems: 'center',
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
