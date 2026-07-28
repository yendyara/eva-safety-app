/**
 * Alert triggered screen.
 *
 * The tone here is deliberately flat and calm — "Alert sent." not
 * "ALERT SENT!!!" — because the person reading this is already in the
 * highest-stress moment the app is built for. A confirmation screen that
 * matches that intensity back at them amplifies panic instead of helping
 * them regulate. The UI's job at this exact moment is to de-escalate: state
 * plainly what happened, show who was reached, and get out of the way.
 */
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLink } from '@/components/TextLink';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { formatCoordinates } from '@/utils/getLocation';
import { AlertResult, sendSafeCancellation } from '@/utils/sendAlert';

const EMERGENCY_NUMBERS = { EU: '112', US: '911' } as const;

const STATUS_COPY: Record<AlertResult['composerResult'], string> = {
  sent: "I've let your contacts know you need help.",
  unknown: "I've let your contacts know you need help.",
  cancelled: "I didn't send your alert.",
  unavailable: "I can't send text messages on this device.",
};

export default function AlertSentScreen() {
  const router = useRouter();
  const { colors, settings } = useAppTheme();
  const params = useLocalSearchParams<{ result: string; latitude?: string; longitude?: string }>();
  const [cancelStatus, setCancelStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const result: AlertResult = useMemo(() => JSON.parse(params.result), [params.result]);
  const coords = useMemo(() => {
    if (!params.latitude || !params.longitude) return null;
    return { latitude: Number(params.latitude), longitude: Number(params.longitude) };
  }, [params.latitude, params.longitude]);

  const formattedTime = useMemo(
    () => new Date(result.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    [result.timestamp]
  );

  const handleCopyCoordinates = async () => {
    if (!coords) return;
    await Clipboard.setStringAsync(formatCoordinates(coords, settings.coordinateFormat));
  };

  const handleCall = () => {
    Linking.openURL(`tel:${EMERGENCY_NUMBERS[settings.emergencyRegion]}`);
  };

  const handleCancelAlert = async () => {
    setCancelStatus('sending');
    await sendSafeCancellation(result.contacts);
    setCancelStatus('sent');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.backButton}
      >
        <Text style={[styles.backArrow, { color: colors.textPrimary }]}>←</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[Typography.heading, { color: colors.textPrimary }]}>
          {STATUS_COPY[result.composerResult]}
        </Text>

        <View style={styles.contactList}>
          {result.contacts.map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>{contact.name}</Text>
              {contact.confirmed && (
                <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.metaBlock}>
          {coords ? (
            <Text
              onPress={handleCopyCoordinates}
              style={[Typography.label, { color: colors.textSecondary }]}
            >
              {formatCoordinates(coords, settings.coordinateFormat)}  ·  Tap to copy
            </Text>
          ) : (
            <Text style={[Typography.label, { color: colors.textSecondary }]}>
              I couldn’t get your location.
            </Text>
          )}
          <Text style={[Typography.label, { color: colors.textSecondary }]}>{formattedTime}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Call emergency services" onPress={handleCall} />
        {cancelStatus === 'sent' ? (
          <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
            I’ve let your contacts know you’re safe.
          </Text>
        ) : (
          <TextLink
            label={cancelStatus === 'sending' ? 'Sending…' : "I'm safe, cancel alert"}
            onPress={handleCancelAlert}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  backArrow: {
    fontSize: 22,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    gap: Spacing.xl,
  },
  contactList: {
    gap: Spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '600',
  },
  metaBlock: {
    gap: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
});
