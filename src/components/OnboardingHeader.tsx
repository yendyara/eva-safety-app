/**
 * Shared top bar for the onboarding sequence: an optional back arrow and an
 * optional "Skip" link.
 *
 * Skip only ever advances past the current step to the next one in the
 * sequence — it never exits onboarding early. Phase 1 (understanding EVA)
 * omits onSkip entirely, since that phase is explanatory only and isn't
 * skippable; Phase 2 (setup) passes onSkip so each configuration step can
 * be individually bypassed without dropping the user back into the app
 * before they've seen the rest of the sequence.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { useAppTheme } from '@/utils/colorSystem';

type OnboardingHeaderProps = {
  onBack?: () => void;
  onSkip?: () => void;
};

export function OnboardingHeader({ onBack, onSkip }: OnboardingHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.touchArea}
        >
          <Text style={[styles.backArrow, { color: colors.textPrimary }]}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.touchArea} />
      )}

      {onSkip ? (
        <Pressable
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip this step"
          style={styles.touchArea}
        >
          <Text style={[styles.skipLabel, { color: colors.textSecondary }]}>Skip</Text>
        </Pressable>
      ) : (
        <View style={styles.touchArea} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  touchArea: {
    minWidth: MIN_TAP_TARGET,
    minHeight: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
  },
  skipLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
