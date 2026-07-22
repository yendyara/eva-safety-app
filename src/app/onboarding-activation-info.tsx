/**
 * Onboarding, Phase 1 ("Understanding EVA") — step 5 of 5 — the concept of
 * triggering eva without opening it, before Phase 2 offers to set it up.
 *
 * Concept only, deliberately no buttons or deep links here — this is the
 * last Phase 1 screen, so the only forward action is moving into Phase 2.
 * The actual guided setup (copy the link, create the Shortcut, assign it
 * to Back Tap) lives on onboarding-shortcuts.tsx.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

export default function OnboardingActivationInfoScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            You don’t have to open eva to use it
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            Double or triple tapping the back of your phone, a Siri
            Shortcut, or hiding eva’s icon from your Home Screen entirely —
            eva can work without ever being visibly open. Next, you’ll get
            the chance to set any of this up.
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
