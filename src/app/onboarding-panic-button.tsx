/**
 * Onboarding, step 2 of 5 — explains the panic button before anyone has to
 * rely on it under stress.
 *
 * The static circle mock here isn't decoration — the global design
 * principle is "nothing decorative that doesn't serve the user," and
 * showing the actual button (inert, no hold timer) so it's recognizable
 * later is the one exception that earns its place: familiarity in the
 * moment that matters is worth the one static shape.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { setOnboardingComplete } from '@/utils/storage';

const PREVIEW_DIAMETER = 140;

export default function OnboardingPanicButtonScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleSkip = async () => {
    await setOnboardingComplete();
    router.replace('/home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} onSkip={handleSkip} />

      <View style={styles.content}>
        <View
          style={[
            styles.preview,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={[styles.previewLabel, { color: colors.onPrimary }]}>Hold to activate</Text>
        </View>

        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            The panic button
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            Hold the button for 3 seconds to alert your trusted contacts and
            share your location with them.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={() => router.push('/onboarding-contacts')} />
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
    gap: Spacing.xxl,
  },
  preview: {
    width: PREVIEW_DIAMETER,
    height: PREVIEW_DIAMETER,
    borderRadius: PREVIEW_DIAMETER,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  previewLabel: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
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
