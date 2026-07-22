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
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PanicButton } from '@/components/PanicButton';
import { TextLink } from '@/components/TextLink';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { useAppTheme } from '@/utils/colorSystem';
import { triggerPanicAlert } from '@/utils/triggerAlert';

const EMERGENCY_NUMBERS = { EU: '112', US: '911' } as const;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, settings } = useAppTheme();
  const [status, setStatus] = useState<string | null>(null);

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
        <Text style={[styles.wordmark, { color: colors.primary }]}>EVA</Text>
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
          accessibilityLabel="Hide EVA"
          style={styles.decoyTrigger}
        >
          <Text style={[styles.decoyGlyph, { color: colors.textSecondary }]}>×</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

/** A minimal gear glyph built from Text — avoids pulling in an icon library for one icon. */
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
