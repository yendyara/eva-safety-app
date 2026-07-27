/**
 * Decoy screen — instantly replaces EVA with a disguise the user configured
 * themselves in Settings.
 *
 * Reached only via the × on Home (which only appears once decoy mode is
 * turned on). Two ways out, both hidden inside DecoyNotes' corner gesture:
 * a triple-tap for a casual return to Home, and a 3-second hold that sends
 * the real alert directly — same trigger sequence as quick-alert.tsx —
 * without ever needing to reveal Home first. This screen intentionally
 * renders no EVA UI at all — not even the app's color tokens — so a phone
 * check by an abuser finds nothing but whatever plain label the user picked.
 */
import { useRouter } from 'expo-router';

import { DecoyNotes } from '@/components/DecoyNotes';
import { useAppTheme } from '@/utils/colorSystem';
import { triggerPanicAlert } from '@/utils/triggerAlert';

export default function DecoyScreen() {
  const router = useRouter();
  const { settings } = useAppTheme();

  const handleEmergencyHold = async () => {
    try {
      const { params } = await triggerPanicAlert();
      router.replace({ pathname: '/alert-sent', params });
    } catch {
      router.replace('/home');
    }
  };

  return (
    <DecoyNotes
      label={settings.decoy.label}
      icon={settings.decoy.icon}
      color={settings.decoy.color}
      onReveal={() => router.replace('/home')}
      onEmergencyHold={handleEmergencyHold}
    />
  );
}
