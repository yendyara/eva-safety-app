/**
 * Onboarding, Phase 1 ("Understanding EVA") — step 4 of 5 — what happens
 * if the alert turns out to be a false alarm.
 *
 * This exists as its own step because it matters for the same reason the
 * 3-second hold does: knowing in advance that a false trigger is easy to
 * walk back removes a reason to hesitate before ever using the button.
 * The actual control lives on the Alert Sent screen — see alert-sent.tsx.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

export default function OnboardingFalseAlarmInfoScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            If it’s a false alarm
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            After an alert goes out, if you’re safe, one tap sends a
            follow-up text telling your contacts to disregard it. No call,
            no explanation needed in the moment.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue"
          onPress={() => router.push('/onboarding-activation-info')}
        />
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
