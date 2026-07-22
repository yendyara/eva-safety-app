/**
 * The Back Tap / Siri Shortcuts entry point — evasafetyapp://quick-alert.
 *
 * iOS gives third-party apps no way to inject a control into Back Tap,
 * Control Center, the Lock Screen, or another app like Notes or Phone —
 * those surfaces only accept the OS's own Shortcuts/Widgets/Back Tap
 * system, which triggers independently of any app being open. What we
 * *can* do is give that system something reliable to call: this route.
 * A Shortcut built in Apple's Shortcuts app with an "Open URL" action
 * pointing here — then assigned to Back Tap, a Siri phrase, Control
 * Center, or the Lock Screen — reaches this screen without the user ever
 * having opened EVA or navigated its UI. See Settings and the onboarding
 * "trigger it without opening the app" step for the guided setup.
 *
 * Sending an SMS still can't happen fully silently on iOS (see
 * sendAlert.ts), so this briefly foregrounds the app to run the same
 * trigger sequence as the on-screen panic button, then lands on the exact
 * same Alert Sent screen — including the "I'm safe — cancel alert" flow.
 */
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/utils/colorSystem';
import { triggerPanicAlert } from '@/utils/triggerAlert';

export default function QuickAlertScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    triggerPanicAlert()
      .then(({ params }) => {
        router.replace({ pathname: '/alert-sent', params });
      })
      .catch(() => {
        router.replace('/home');
      });
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.status, { color: colors.textSecondary }]}>Sending alert…</Text>
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
  },
  status: {
    fontSize: 16,
  },
});
