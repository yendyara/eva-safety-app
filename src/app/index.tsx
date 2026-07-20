/**
 * Onboarding, screen 1 — Welcome.
 *
 * Deliberately restrained: no illustration, no icon, no onboarding
 * carousel. Every extra element here is one more thing standing between a
 * person and the panic button. The whitespace is the design — it signals
 * "calm" before the app has said a single word.
 *
 * Light mode is the default across EVA, not just here, because dark UIs in
 * a high-stress moment tend to read as heavier and more closed-in. Generous
 * negative space on a warm, light background produces a calmer first
 * response than a dark, dense one would.
 *
 * On mount this screen checks whether onboarding was already completed
 * (i.e. trusted contacts exist) and, if so, skips straight to Home — this
 * screen only appears once, on first install.
 */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { hasCompletedOnboarding } from '@/utils/storage';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    hasCompletedOnboarding().then((completed) => {
      if (completed) {
        router.replace('/home');
      } else {
        setIsChecking(false);
      }
    });
  }, [router]);

  if (isChecking) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.wordmark, { color: colors.primary }]}>EVA</Text>

        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            Protection, one tap away.
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            EVA stays with you. Quietly, quickly, always ready.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Get started" onPress={() => router.push('/onboarding-contacts')} />
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
    fontSize: 20,
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
