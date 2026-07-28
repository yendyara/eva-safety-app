/**
 * EVA's color system.
 *
 * The palette started as fuchsia, targeted at women. It moved to amber and
 * terracotta as the product repositioned as gender-neutral protection for
 * anyone experiencing domestic abuse — same warmth and boldness, deeper and
 * more universal.
 *
 * Three-tier urgency escalation — always in this order, never skipped or
 * reordered:
 * - amber (`primary`): tier 1, calm / default action. Every primary button,
 *   the wordmark, the brand color at rest.
 * - terracotta (`progress`, "Progress / links"): tier 2, alert sent /
 *   elevated. Progress indicators (the hold-to-trigger arc's base, the
 *   breathing exhale), tappable links.
 * - saffron (`alert`, "Alerts / urgency"): tier 3, active emergency. Not yet
 *   wired into any screen, but kept distinct so a genuinely urgent state
 *   never has to borrow a color that already means "in progress."
 *
 * borderSubtle vs borderDefined: borderSubtle is the default hairline
 * (dividers, section separators, input outlines, card outlines) — nearly
 * everything. borderDefined is reserved for emphasis, specifically the
 * secondary button's border, which needs to read as a deliberate outline
 * rather than a passive hairline.
 *
 * positive ("safe / confirmed") and negative ("destructive"): a forest
 * green and a burnt orange, for the rare cases that need to read
 * unambiguously as "good" or "undo-this-carefully" — a confirmed-safe
 * state, a "Remove contact" action.
 *
 * Nothing in this app uses actual red — red reads as alarm and amplifies
 * panic in a user who is already in a high-stress state. `negative` stays
 * in the same warm-orange family as the rest of the palette (closer to
 * terracotta than to red) specifically so a destructive action still reads
 * as "this app" rather than triggering that alarm response.
 */

export type ThemeTokens = {
  background: string;
  primary: string;
  progress: string;
  alert: string;
  textPrimary: string;
  textSecondary: string;
  card: string;
  borderSubtle: string;
  borderDefined: string;
  positive: string;
  negative: string;
  /** Text color for content sitting directly on a primary-filled surface (e.g. the panic button label). */
  onPrimary: string;
};

export const LightColors: ThemeTokens = {
  background: '#FAF7F4',
  primary: '#8B5E3C',
  progress: '#C4603A',
  alert: '#E8A020',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  card: '#FFFFFF',
  borderSubtle: '#E8E0D8',
  borderDefined: '#C4BAB0',
  positive: '#3D7A4A',
  negative: '#C45C2A',
  onPrimary: '#FFF8F2',
};

export const DarkColors: ThemeTokens = {
  background: '#0F0F0F',
  // Amber and terracotta carry over unchanged in dark mode — the identity
  // color shouldn't shift with the system theme, only the neutrals around it.
  primary: '#8B5E3C',
  progress: '#C4603A',
  alert: '#E8A020',
  textPrimary: '#F5F0EB',
  textSecondary: '#9E9E9E',
  card: '#1C1C1C',
  borderSubtle: '#2A2A2A',
  // Same defined-border tone as light mode — it's already dark/neutral
  // enough to read clearly against the dark surface without adjustment.
  borderDefined: '#C4BAB0',
  // Lighter/more vivid than the light-mode values — both need the extra
  // luminance to hold their weight and stay legible against a dark surface.
  positive: '#6AAF7A',
  negative: '#E06B35',
  onPrimary: '#FFF8F2',
};

export type ColorScheme = 'light' | 'dark';
export type ColorToken = keyof ThemeTokens;

export const Colors: Record<ColorScheme, ThemeTokens> = {
  light: LightColors,
  dark: DarkColors,
};
