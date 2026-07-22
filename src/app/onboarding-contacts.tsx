/**
 * Onboarding, Phase 2 ("Setup") — step 1 of 5 — add trusted contacts.
 *
 * This screen only asks; the actual picking happens on the contacts-picker
 * screen (import from the device, screened for likely partner/family
 * matches, with a manual-entry fallback if contacts permission is
 * denied). Keeping the ask and the picker separate means skipping this
 * step is a single tap, not an abandoned form.
 *
 * Skip and the picker's finish both land on the same next Phase 2 step
 * (activation method) — bypassing this step is exactly as valid a path
 * through onboarding as completing it, never an early exit.
 *
 * No sign-up, no account, nothing sent anywhere — contacts are written
 * straight to AsyncStorage on this device. An account is a record, and a
 * record is something that can be found. For someone whose safety depends
 * on an abuser not knowing this app exists, skipping account creation
 * isn't a convenience shortcut, it's the whole point: there is nothing to
 * discover outside the phone itself.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

export default function OnboardingContactsAskScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader
        onBack={() => router.back()}
        onSkip={() => router.push('/onboarding-activation')}
      />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            Add your trusted contacts
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            Add them now, or skip and do this later from Settings.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Choose contacts"
          onPress={() =>
            router.push({
              pathname: '/contacts-picker',
              params: { returnTo: '/onboarding-activation' },
            })
          }
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
