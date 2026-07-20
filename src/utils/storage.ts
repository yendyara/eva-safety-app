/**
 * All persistence for EVA. Everything lives on-device via AsyncStorage —
 * there is no account, no server, no sync. That's a deliberate safety
 * choice, not a missing feature: an account is a record that ties this app
 * to a person's identity somewhere outside their control. For someone
 * living with an abuser, that record is a liability. Local-only storage
 * means EVA leaves no trace beyond the device itself, and uninstalling the
 * app erases it completely.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TrustedContact = {
  id: string;
  name: string;
  phone: string;
};

export type EmergencyRegion = 'EU' | 'US';
export type CoordinateFormat = 'decimal' | 'dms';
export type ThemeMode = 'system' | 'light' | 'dark';

export type AppSettings = {
  emergencyRegion: EmergencyRegion;
  coordinateFormat: CoordinateFormat;
  themeMode: ThemeMode;
};

export const DEFAULT_SETTINGS: AppSettings = {
  emergencyRegion: 'EU',
  coordinateFormat: 'decimal',
  themeMode: 'system',
};

const KEYS = {
  contacts: 'eva:trustedContacts',
  settings: 'eva:settings',
} as const;

export async function getContacts(): Promise<TrustedContact[]> {
  const raw = await AsyncStorage.getItem(KEYS.contacts);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TrustedContact[];
  } catch {
    // Corrupted local data shouldn't crash the one screen a survivor is
    // relying on — fall back to empty and let them re-enter contacts.
    return [];
  }
}

export async function saveContacts(contacts: TrustedContact[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.contacts, JSON.stringify(contacts));
}

/**
 * Onboarding is considered complete once at least one trusted contact is
 * saved. That single check is what lets the welcome screen route returning
 * users straight to the panic button instead of re-running setup.
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const contacts = await getContacts();
  return contacts.length > 0;
}

export async function getSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}
