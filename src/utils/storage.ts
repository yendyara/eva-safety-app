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

/**
 * A contact the person has explicitly said should never receive an alert.
 * This exists alongside trusted contacts, not inside them — someone can be
 * screened out before ever being added, so there's no "add then remove"
 * step where a single missed tap could send them an alert.
 */
export type ExcludedContact = {
  id: string;
  name: string;
  phone: string;
};

export type EmergencyRegion = 'EU' | 'US';
export type CoordinateFormat = 'decimal' | 'dms';
export type ThemeMode = 'system' | 'light' | 'dark';
export type ActivationMethod = 'hold' | 'volume';

/**
 * The disguise decoy mode presents when active. Deliberately just a label,
 * an icon glyph, and a color — no preset "themes" (a recipe app, a period
 * tracker, a makeup tutorial). Presets like that assume something about who
 * is using EVA and what would plausibly be on their phone; a blank slate
 * the person fills in themselves makes no assumption at all.
 */
export type DecoySettings = {
  enabled: boolean;
  label: string;
  icon: string;
  color: string;
};

export const DEFAULT_DECOY_SETTINGS: DecoySettings = {
  enabled: false,
  label: 'Notes',
  icon: '📝',
  color: '#8E8E93',
};

export type AppSettings = {
  emergencyRegion: EmergencyRegion;
  coordinateFormat: CoordinateFormat;
  themeMode: ThemeMode;
  activationMethod: ActivationMethod;
  decoy: DecoySettings;
};

export const DEFAULT_SETTINGS: AppSettings = {
  emergencyRegion: 'EU',
  coordinateFormat: 'decimal',
  themeMode: 'system',
  activationMethod: 'hold',
  decoy: DEFAULT_DECOY_SETTINGS,
};

/** Trusted contacts are capped at 3 — see ContactForm for the reasoning. */
export const MAX_TRUSTED_CONTACTS = 3;

const KEYS = {
  contacts: 'eva:trustedContacts',
  settings: 'eva:settings',
  excludedContacts: 'eva:excludedContacts',
  onboardingComplete: 'eva:onboardingComplete',
} as const;

/**
 * Excluded-contact matching is by phone number, not name — names can be
 * edited or entered inconsistently, but a phone number is what an alert
 * actually gets sent to. Comparing the last 10 digits means "+1 555 123
 * 4567" and "(555) 123-4567" are recognized as the same number.
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10) || digits;
}

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

/**
 * Excluded numbers are stripped out here, at the single place all trusted
 * contacts get written — every screen that saves contacts (onboarding, the
 * contacts picker, Settings) goes through this function, so there's one
 * place a screening block can't be bypassed by a new call site later.
 */
export async function saveContacts(contacts: TrustedContact[]): Promise<void> {
  const filtered = await filterExcludedContacts(contacts);
  await AsyncStorage.setItem(KEYS.contacts, JSON.stringify(filtered));
}

export async function getExcludedContacts(): Promise<ExcludedContact[]> {
  const raw = await AsyncStorage.getItem(KEYS.excludedContacts);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ExcludedContact[];
  } catch {
    return [];
  }
}

/**
 * Adds contacts to the permanent exclusion list and immediately purges any
 * of them that are already saved as a trusted contact — blocking someone
 * shouldn't leave them sitting in the trusted list until the next save.
 */
export async function excludeContacts(newlyExcluded: ExcludedContact[]): Promise<void> {
  if (newlyExcluded.length === 0) return;

  const existing = await getExcludedContacts();
  const existingPhones = new Set(existing.map((c) => normalizePhone(c.phone)));
  const merged = [
    ...existing,
    ...newlyExcluded.filter((c) => !existingPhones.has(normalizePhone(c.phone))),
  ];
  await AsyncStorage.setItem(KEYS.excludedContacts, JSON.stringify(merged));

  const currentTrusted = await getContacts();
  await saveContacts(currentTrusted); // re-run through the exclusion filter to purge them now
}

export async function filterExcludedContacts<T extends { phone: string }>(
  contacts: T[]
): Promise<T[]> {
  const excluded = await getExcludedContacts();
  if (excluded.length === 0) return contacts;
  const excludedPhones = new Set(excluded.map((c) => normalizePhone(c.phone)));
  return contacts.filter((c) => !excludedPhones.has(normalizePhone(c.phone)));
}

export async function getOnboardingComplete(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.onboardingComplete);
  return raw === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboardingComplete, 'true');
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
