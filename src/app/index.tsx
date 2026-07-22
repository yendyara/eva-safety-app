/**
 * Onboarding, step 1 of 6 — Welcome.
 *
 * Deliberately restrained: no illustration, no icon, no carousel dots.
 * Every extra element here is one more thing standing between a person and
 * the panic button. The whitespace is the design — it signals "calm"
 * before the app has said a single word.
 *
 * Light mode is the default across EVA, not just here, because dark UIs in
 * a high-stress moment tend to read as heavier and more closed-in. Generous
 * negative space on a warm, light background produces a calmer first
 * response than a dark, dense one would.
 *
 * On mount this screen checks an explicit "onboarding complete" flag (set
 * on finishing OR skipping the sequence) and, if it's already set, skips
 * straight to Home — the whole 5-step sequence only ever runs once.
 */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '@/components/OnboardingHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { getOnboardingComplete, setOnboardingComplete } from '@/utils/storage';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    getOnboardingComplete().then((completed) => {
      if (completed) {
        router.replace('/home');
      } else {
        setIsChecking(false);
      }
    });
  }, [router]);

  const handleSkip = async () => {
    await setOnboardingComplete();
    router.replace('/home');
  };

  if (isChecking) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onSkip={handleSkip} />

      <View style={styles.content}>
        <Text style={[styles.wordmark, { color: colors.primary }]}>eva</Text>

        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            always with you
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            eva is designed to help you get help quickly and discreetly in an
            emergency.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={() => router.push('/onboarding-panic-button')} />
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
  wordmark: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
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
