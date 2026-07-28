/**
 * A tier-tinted banner: background at ~15% of the tier color, border at
 * full saturation, title in Inter (via Typography.alertTitle). Tier 1
 * ("amber"/primary) is the calm default and never needs banner treatment —
 * only tier 2 (`progress`, elevated) and tier 3 (`alert`, active emergency)
 * apply here.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';

type AlertBannerTier = 'progress' | 'alert';

type AlertBannerProps = {
  tier: AlertBannerTier;
  title: string;
  body?: string;
};

// ~15% opacity as a hex alpha suffix (0.15 * 255 ≈ 0x26) — an exact tint of
// the tier color itself rather than a separately maintained tint palette.
const TINT_ALPHA = '26';

export function AlertBanner({ tier, title, body }: AlertBannerProps) {
  const { colors } = useAppTheme();
  const tierColor = colors[tier];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${tierColor}${TINT_ALPHA}`, borderColor: tierColor },
      ]}
    >
      <Text style={[Typography.alertTitle, { color: colors.textPrimary }]}>{title}</Text>
      {body && <Text style={[Typography.body, { color: colors.textPrimary }]}>{body}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
});
