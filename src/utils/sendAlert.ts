/**
 * Sends the panic alert and the later "I'm safe" cancellation.
 *
 * Platform constraint worth being explicit about: neither iOS nor Android
 * lets a third-party app send SMS completely silently. `expo-sms` opens the
 * native message composer pre-filled with the recipients and body — the
 * person still has to tap Send once in that system UI. EVA can't bypass
 * that even in an emergency; it's an OS-level anti-spam/anti-abuse
 * guarantee, not a gap in this app. The product accounts for it by getting
 * everything else (location lookup, message copy, recipient list) done
 * automatically so that one tap is all that's left.
 *
 * Delivery confirmation is similarly limited: Android's composer never
 * reports whether the message actually sent, only that the flow finished,
 * so a completed (non-cancelled) composer is treated as success on both
 * platforms. That ambiguity is why the confirmation screen says "sent",
 * not "delivered" — it's the honest claim EVA can actually back up.
 */
import * as SMS from 'expo-sms';

import { Coordinates, toGoogleMapsLink } from '@/utils/getLocation';
import { TrustedContact } from '@/utils/storage';

export type ComposerResult = 'sent' | 'cancelled' | 'unknown' | 'unavailable';

export type AlertContactResult = TrustedContact & { confirmed: boolean };

export type AlertResult = {
  composerResult: ComposerResult;
  contacts: AlertContactResult[];
  timestamp: number;
};

export function buildHelpMessage(coords: Coordinates | null): string {
  // Location is best-effort: if permission was denied or a fix couldn't be
  // acquired in time, the alert still has to go out. Reaching contacts
  // without coordinates beats not reaching them at all.
  if (!coords) {
    return 'I need help. Please reach me or call emergency services.';
  }
  return `I need help. My location: ${toGoogleMapsLink(coords)}. Please reach me or call emergency services.`;
}

export const SAFE_CANCELLATION_MESSAGE =
  "I'm safe now. Please disregard the previous alert. Thank you.";

async function sendComposedMessage(
  contacts: TrustedContact[],
  message: string
): Promise<ComposerResult> {
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) {
    return 'unavailable';
  }
  const phoneNumbers = contacts.map((contact) => contact.phone);
  const { result } = await SMS.sendSMSAsync(phoneNumbers, message);
  return result as ComposerResult;
}

export async function sendHelpAlert(
  contacts: TrustedContact[],
  coords: Coordinates | null
): Promise<AlertResult> {
  const timestamp = Date.now();
  const composerResult = await sendComposedMessage(contacts, buildHelpMessage(coords));
  const confirmed = composerResult === 'sent' || composerResult === 'unknown';

  return {
    composerResult,
    timestamp,
    contacts: contacts.map((contact) => ({ ...contact, confirmed })),
  };
}

export async function sendSafeCancellation(
  contacts: TrustedContact[]
): Promise<ComposerResult> {
  return sendComposedMessage(contacts, SAFE_CANCELLATION_MESSAGE);
}
