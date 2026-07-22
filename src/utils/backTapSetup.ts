/**
 * Helpers for pointing someone at the native iOS setup for Back Tap /
 * Shortcuts, and for building the link their Shortcut needs to call.
 *
 * There is no API for a third-party app to register itself as a Back Tap
 * action or to pre-fill a Shortcut's steps — the person has to build a
 * one-step Shortcut themselves (Shortcuts app → new shortcut → "Open URL"
 * action → this link) and assign it to Back Tap in Settings. These helpers
 * exist to remove as much friction from that process as code can: getting
 * the exact link onto the clipboard, and jumping straight to the relevant
 * screens instead of making someone hunt for them.
 */
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';

/**
 * `App-Prefs:` is an undocumented, unofficial URL scheme — not something
 * Apple guarantees will keep working. It's been reported unreliable since
 * iOS 18 (silently opens Settings' root instead of the Back Tap screen).
 * It's still worth attempting since it works on many devices, but the
 * caller should never depend on it alone — see the written steps in
 * Settings and onboarding, which work regardless of whether this lands.
 */
const BACK_TAP_SETTINGS_URL = 'App-Prefs:root=ACCESSIBILITY&path=TOUCH_REACHABILITY_TITLE/Back Tap';

export function getQuickAlertLink(): string {
  return Linking.createURL('/quick-alert');
}

export async function copyQuickAlertLink(): Promise<void> {
  await Clipboard.setStringAsync(getQuickAlertLink());
}

export async function openShortcutsApp(): Promise<void> {
  try {
    await Linking.openURL('shortcuts://create-shortcut');
  } catch {
    // Shortcuts is a stock app on every supported iOS version, so this
    // should never fail — but never let a failed deep link block the flow.
  }
}

/** Best-effort deep link to Back Tap settings, with a guaranteed fallback. */
export async function openBackTapSettings(): Promise<void> {
  try {
    await Linking.openURL(BACK_TAP_SETTINGS_URL);
  } catch {
    await Linking.openSettings();
  }
}
