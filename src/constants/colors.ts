/**
 * EVA's color system.
 *
 * The palette started as fuchsia, targeted at women. It moved to amber and
 * terracotta as the product repositioned as gender-neutral protection for
 * anyone experiencing domestic abuse — same warmth and boldness, deeper and
 * more universal.
 *
 * Hard rule: terracotta is reserved for moments that need attention (the
 * breathing exhale, the hold-to-trigger arc, the confirmed-alert state,
 * urgent labels). Amber carries every other primary action. Nothing in this
 * app uses red — red reads as alarm and amplifies panic in a user who is
 * already in a high-stress state. Terracotta signals urgency without
 * aggression.
 */

export type ThemeTokens = {
  background: string;
  primary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  surface: string;
  border: string;
  /** Text color for content sitting directly on a primary-filled surface (e.g. the panic button label). */
  onPrimary: string;
};

export const LightColors: ThemeTokens = {
  background: '#FAF7F4',
  primary: '#8B5E3C',
  accent: '#C4603A',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  surface: '#FFFFFF',
  border: '#E8E0D8',
  onPrimary: '#FFF8F2',
};

export const DarkColors: ThemeTokens = {
  background: '#0F0F0F',
  // Amber and terracotta carry over unchanged in dark mode — the identity
  // color shouldn't shift with the system theme, only the neutrals around it.
  primary: '#8B5E3C',
  accent: '#C4603A',
  textPrimary: '#F5F0EB',
  textSecondary: '#9E9E9E',
  surface: '#1C1C1C',
  border: '#2A2A2A',
  onPrimary: '#FFF8F2',
};

export type ColorScheme = 'light' | 'dark';
export type ColorToken = keyof ThemeTokens;

export const Colors: Record<ColorScheme, ThemeTokens> = {
  light: LightColors,
  dark: DarkColors,
};
