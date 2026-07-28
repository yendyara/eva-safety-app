/**
 * Type scale.
 *
 * Two-track system, per the design spec: body/general UI text stays on the
 * platform system font (SF Pro on iOS, Roboto on Android) — no custom font
 * loading, fast first paint, no flash of unstyled text, which matters when
 * someone opens this app in a moment of urgency. Headlines and alert/warning
 * titles use Inter (600/800, loaded in _layout.tsx) instead — the font
 * change itself signals "this matters," not just size or color.
 */
import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
  },
  /** The title line of an alert/warning banner — see AlertBanner. */
  alertTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 17,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25.6, // 16 * 1.6 — read under stress, deliberately looser than typical UI line-height
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.24, // 0.02em at 12px — RN letterSpacing is points, not em
  },
});
