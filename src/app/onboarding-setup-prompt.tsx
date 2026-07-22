/**
 * The hinge between Phase 1 and Phase 2 — a single explicit decision
 * point rather than letting Phase 2 just start automatically.
 *
 * "I'll do this later" here is a real exit, not a skip: it finishes
 * onboarding immediately and drops straight into Home, with no "You're
 * all set" screen, since nothing was actually set up (see
 * onboarding-ready.tsx for why that message is reserved for genuine
 * engagement). Setup stays reachable afterward — from Settings any time,
 * or via the reminder banner on Home (see home.tsx).
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLink } from '@/components/TextLink';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { setOnboardingComplete } from '@/utils/storage';

export default function OnboardingSetupPromptScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleLater = async () => {
    await setOnboardingComplete();
    router.replace('/home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            Ready to set up your account?
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            Add trusted contacts, choose how alerts trigger, and set up
            Back Tap — or come back to it whenever you're ready.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Set up now" onPress={() => router.push('/onboarding-contacts')} />
        <TextLink label="I'll do this later" onPress={handleLater} colorToken="textSecondary" />
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
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
