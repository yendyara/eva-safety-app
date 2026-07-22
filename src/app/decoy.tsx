/**
 * Decoy screen — instantly replaces EVA with a disguise the user configured
 * themselves in Settings.
 *
 * Reached only via the × on Home (which only appears once decoy mode is
 * turned on), and left only via the hidden triple-tap inside DecoyNotes.
 * This screen intentionally renders no EVA UI at all — not even the app's
 * color tokens — so a phone check by an abuser finds nothing but whatever
 * plain label the user picked.
 */
import { useRouter } from 'expo-router';

import { DecoyNotes } from '@/components/DecoyNotes';
import { useAppTheme } from '@/utils/colorSystem';

export default function DecoyScreen() {
  const router = useRouter();
  const { settings } = useAppTheme();

  return (
    <DecoyNotes
      label={settings.decoy.label}
      icon={settings.decoy.icon}
      color={settings.decoy.color}
      onReveal={() => router.replace('/home')}
    />
  );
}
