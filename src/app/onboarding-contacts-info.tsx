/**
 * Onboarding, Phase 1 ("Understanding EVA") — step 3 of 5 — what trusted
 * contacts are and how an alert reaches them.
 *
 * Purely explanatory — no permission requests, no picking anyone yet.
 * That happens in Phase 2 (see onboarding-contacts.tsx), once the person
 * already understands what adding someone actually does.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

export default function OnboardingContactsInfoScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            Who eva alerts
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            Up to 3 trusted people — a partner, a sibling, a close friend.
            When you trigger eva, they instantly get a text with your
            location, so they can reach you or call for help on your behalf.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue"
          onPress={() => router.push('/onboarding-false-alarm-info')}
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
