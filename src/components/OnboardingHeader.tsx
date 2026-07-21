/**
 * Shared top bar for the onboarding sequence: an optional back arrow and a
 * "Skip" link. Skipping from any step jumps straight to Home, not just past
 * that one step — onboarding is meant to help, never to gate access to the
 * panic button, so nothing about it should feel mandatory.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { useAppTheme } from '@/utils/colorSystem';

type OnboardingHeaderProps = {
  onBack?: () => void;
  onSkip: () => void;
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

      <Pressable
        onPress={onSkip}
        accessibilityRole="button"
        accessibilityLabel="Skip initial setup"
        style={styles.touchArea}
      >
        <Text style={[styles.skipLabel, { color: colors.textSecondary }]}>Skip</Text>
      </Pressable>
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
