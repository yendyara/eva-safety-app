/**
 * Spacing scale and shared layout constants.
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Stress narrows fine motor control, so every interactive element on EVA
 * meets the 48px minimum tap target regardless of how small it looks —
 * including the discreet decoy trigger, which is small by design but still
 * needs to be reliably tappable under duress.
 */
export const MIN_TAP_TARGET = 48;

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 999,
} as const;
