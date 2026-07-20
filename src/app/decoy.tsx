/**
 * Decoy screen — instantly replaces EVA with a fake notes app.
 *
 * Reached only via the × on Home, and left only via the hidden triple-tap
 * inside DecoyNotes. This screen intentionally renders no EVA UI at all —
 * not even the app's color tokens — so a phone check by an abuser finds
 * nothing but a boring notes app.
 */
import { useRouter } from 'expo-router';

import { DecoyNotes } from '@/components/DecoyNotes';

export default function DecoyScreen() {
  const router = useRouter();

  return <DecoyNotes onReveal={() => router.replace('/home')} />;
}
