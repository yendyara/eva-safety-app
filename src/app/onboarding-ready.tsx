/**
 * Onboarding, step 5 of 5 — the sequence's actual finish line.
 *
 * No skip link here — there's nothing left to skip. This is also the one
 * place the onboarding-complete flag gets set on a genuine finish, not a
 * bail-out, mirroring how every earlier step's "Skip" sets the same flag.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { setOnboardingComplete } from '@/utils/storage';

export default function OnboardingReadyScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleFinish = async () => {
    await setOnboardingComplete();
    router.replace('/home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
          You’re all set.
        </Text>
        <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
          eva is ready to be by your side.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Go to Home" onPress={handleFinish} />
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
