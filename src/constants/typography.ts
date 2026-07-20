/**
 * Type scale.
 *
 * System font only (SF Pro on iOS, Roboto on Android) — no custom font
 * loading. That keeps first paint fast and avoids a flash of unstyled text,
 * which matters when someone opens this app in a moment of urgency.
 */
import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24, // 16 * 1.5
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.26, // 0.02em at 13px — RN letterSpacing is points, not em
  },
});
