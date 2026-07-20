/**
 * The one primary action per screen: full-width, amber, rounded.
 *
 * Deliberately not reused for anything urgent or destructive — amber is
 * the "do the main thing" color across EVA (Get started, I'm ready, Call
 * emergency services), while terracotta is reserved for moments that need
 * attention. Keeping that split consistent is what lets color alone carry
 * meaning without the user having to read every label under stress.
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { useAppTheme } from '@/utils/colorSystem';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[
        styles.button,
        { backgroundColor: colors.primary, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TAP_TARGET,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
