/**
 * Onboarding, step 4 of 6 — trigger EVA without opening it.
 *
 * This is the discreet path: Back Tap or a Siri Shortcut, both of which
 * fire without unlocking the phone or navigating any UI. Setting it up
 * means briefly leaving EVA for the Shortcuts app and iOS Settings, so
 * this step is explicitly optional and explicitly resumable later — see
 * the same guide reachable from Settings at any time.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTapGuide } from '@/components/BackTapGuide';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { TextLink } from '@/components/TextLink';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { setOnboardingComplete } from '@/utils/storage';

export default function OnboardingShortcutsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleSkip = async () => {
    await setOnboardingComplete();
    router.replace('/home');
  };

  const handleLater = () => {
    router.push('/onboarding-activation');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <OnboardingHeader onBack={() => router.back()} onSkip={handleSkip} />

      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={[Typography.heading, styles.headline, { color: colors.textPrimary }]}>
            Trigger eva without opening it
          </Text>
          <Text style={[Typography.body, styles.subtext, { color: colors.textSecondary }]}>
            Double or triple tap the back of your phone (Back Tap) or use a
            Siri Shortcut to send an alert — no unlocking, no app to
            navigate. Once it’s set up, you can also remove the eva icon
            from your Home Screen and keep it in your App Library only.
          </Text>
        </View>

        <BackTapGuide primaryLabel="Set this up now" />
      </View>

      <View style={styles.footer}>
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
  subtext: {
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
