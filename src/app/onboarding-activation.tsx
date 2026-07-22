/**
 * Onboarding, Phase 2 ("Setup") — step 2 of 5 — choose how the alert gets
 * triggered.
 *
 * Two options are stored here: holding the on-screen button (the only
 * mechanism actually wired up today — see PanicButton) and pressing a
 * volume button. The volume-button preference is saved and editable later
 * from Settings, but real hardware key interception isn't implemented yet:
 * it needs a native module outside what Expo Go can run, and bolting that
 * on silently felt worse than being upfront that the choice is captured
 * now and the mechanism follows once the app moves to a dev client.
 */
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { ActivationMethod, markSetupStepComplete } from '@/utils/storage';

const OPTIONS: { value: ActivationMethod; label: string; description: string }[] = [
  {
    value: 'hold',
    label: 'On-screen button',
    description: 'Hold the eva button for 3 seconds.',
  },
  {
    value: 'volume',
    label: 'Volume button',
    description: "Use your phone's volume button to discreetly ask for help.",
  },
];

export default function OnboardingActivationScreen() {
  const router = useRouter();
  const { colors, settings, updateSettings } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader
        onBack={() => router.back()}
        onSkip={() => router.push('/onboarding-shortcuts')}
      />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            How do you want to trigger the alert?
          </Text>
        </View>

        <View style={styles.options}>
          {OPTIONS.map((option) => {
            const isSelected = settings.activationMethod === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  // Marked complete on the actual choice, not on Continue —
                  // clicking through without picking anything isn't
                  // "engaging" with this step (see onboarding-decoy.tsx for
                  // why that distinction determines whether "You're all
                  // set" ever shows).
                  updateSettings({ activationMethod: option.value });
                  markSetupStepComplete('activation');
                }}
                accessibilityRole="button"
                style={[
                  styles.option,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    { color: isSelected ? colors.onPrimary : colors.textPrimary },
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    Typography.body,
                    styles.optionDescription,
                    { color: isSelected ? colors.onPrimary : colors.textSecondary },
                  ]}
                >
                  {option.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={() => router.push('/onboarding-shortcuts')} />
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxl,
  },
  copy: {
    gap: Spacing.md,
  },
  headline: {
    textAlign: 'center',
  },
  options: {
    gap: Spacing.md,
  },
  option: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.lg,
    minHeight: MIN_TAP_TARGET,
    gap: Spacing.xs,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
