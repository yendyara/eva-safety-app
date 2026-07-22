/**
 * The actual alert-sending sequence, shared by every trigger surface —
 * the on-screen panic button today, and the Back Tap / Shortcuts deep link
 * (see app/quick-alert.tsx) — so "what happens when EVA is triggered"
 * lives in exactly one place regardless of how the trigger fired.
 */
import { getCurrentCoordinates } from '@/utils/getLocation';
import { AlertResult, sendHelpAlert } from '@/utils/sendAlert';
import { getContacts } from '@/utils/storage';

export async function triggerPanicAlert(): Promise<{
  result: AlertResult;
  params: Record<string, string>;
}> {
  const contacts = await getContacts();
  const coords = await getCurrentCoordinates();
  const result = await sendHelpAlert(contacts, coords);

  const params: Record<string, string> = {
    result: JSON.stringify(result satisfies AlertResult),
  };
  if (coords) {
    params.latitude = String(coords.latitude);
    params.longitude = String(coords.longitude);
  }

  return { result, params };
}
