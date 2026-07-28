/**
 * Home — the panic button screen.
 *
 * This is where EVA lives. Everything on it answers one question: what
 * does someone need in the first three seconds of reaching for their
 * phone in a crisis? A way to alert people, a way to calm down, a way to
 * call emergency services, and a way to make the app disappear. Nothing
 * else earns a place on this screen.
 *
 * The settings gear is small and top-right rather than a labeled "Settings"
 * button — discreet on purpose, the same way the × decoy trigger is
 * discreet, so the screen doesn't visually announce what this app is to
 * anyone glancing at it over the user's shoulder.
 */
import { Href, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PanicButton } from '@/components/PanicButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLink } from '@/components/TextLink';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import {
  dismissSetupReminderForSession,
  getNextIncompleteSetupRoute,
  isSetupComplete,
  isSetupReminderDismissedForSession,
} from '@/utils/setupProgress';
import { getSetupProgress } from '@/utils/storage';
import { triggerPanicAlert } from '@/utils/triggerAlert';

const EMERGENCY_NUMBERS = { EU: '112', US: '911' } as const;

/**
 * Delay before the setup reminder can appear — long enough that it never
 * competes with the panic button in the first moment someone lands here.
 */
const SETUP_REMINDER_DELAY_MS = 4000;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, settings } = useAppTheme();
  const [status, setStatus] = useState<string | null>(null);
  const [setupReminderRoute, setSetupReminderRoute] = useState<Href | null>(null);

  useEffect(() => {
    if (isSetupReminderDismissedForSession()) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const progress = await getSetupProgress();
      if (cancelled || isSetupComplete(progress)) return;
      setSetupReminderRoute(getNextIncompleteSetupRoute(progress));
    }, SETUP_REMINDER_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const handleContinueSetup = () => {
    if (!setupReminderRoute) return;
    setSetupReminderRoute(null);
    router.push(setupReminderRoute);
  };

  const handleDismissSetupReminder = () => {
    dismissSetupReminderForSession();
    setSetupReminderRoute(null);
  };

  const handleTrigger = useCallback(async () => {
    setStatus('Getting your location…');
    try {
      setStatus('Sending alert…');
      const { params } = await triggerPanicAlert();
      setStatus(null);
      router.push({ pathname: '/alert-sent', params });
    } catch {
      setStatus(null);
    }
  }, [router]);

  const handleEmergencyCall = () => {
    const number = EMERGENCY_NUMBERS[settings.emergencyRegion];
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.wordmark, { color: colors.primary }]}>eva</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          style={styles.iconTouchArea}
        >
          <SettingsGlyph color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.center}>
        <PanicButton onTrigger={handleTrigger} />
        {status && (
          <Text style={[styles.status, { color: colors.textSecondary }]}>{status}</Text>
        )}

        <View style={styles.links}>
          <TextLink label="I need to breathe" onPress={() => router.push('/breathing')} colorToken="textSecondary" />
          <TextLink label="Call emergency services" onPress={handleEmergencyCall} colorToken="textSecondary" />
        </View>
      </View>

      {settings.decoy.enabled && (
        <Pressable
          onPress={() => router.replace('/decoy')}
          accessibilityRole="button"
          accessibilityLabel="Hide eva"
          style={styles.decoyTrigger}
        >
          <Text style={[styles.decoyGlyph, { color: colors.textSecondary }]}>×</Text>
        </Pressable>
      )}

      {setupReminderRoute && (
        <View
          style={[
            styles.setupReminder,
            { backgroundColor: colors.card, borderColor: colors.borderSubtle },
          ]}
        >
          <Text style={[Typography.body, styles.setupReminderText, { color: colors.textPrimary }]}>
            Want to finish setting things up?
          </Text>
          <PrimaryButton label="Continue setup" onPress={handleContinueSetup} />
          <TextLink label="Not now" onPress={handleDismissSetupReminder} colorToken="textSecondary" />
        </View>
      )}
    </SafeAreaView>
  );
}

/**
 * A minimal gear glyph built from Text — avoids pulling in an icon library
 * for one icon. When a real icon set is introduced, this should follow the
 * design-system spec's rounded outline style, 1.5px stroke.
 */
function SettingsGlyph({ color }: { color: string }) {
  return <Text style={{ color, fontSize: 20 }}>⚙</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.select({ android: Spacing.md, default: 0 }),
  },
  wordmark: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
  },
  iconTouchArea: {
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  status: {
    fontSize: 14,
    marginTop: -Spacing.md,
  },
  links: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  setupReminder: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    // Clears the decoy trigger's tap area (bottom: Spacing.md, 48px tall)
    // so the two never overlap when decoy mode is also enabled.
    bottom: Spacing.xxl + Spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  setupReminderText: {
    textAlign: 'center',
  },
  decoyTrigger: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decoyGlyph: {
    fontSize: 20,
    fontWeight: '400',
  },
});
