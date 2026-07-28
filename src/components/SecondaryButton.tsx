/**
 * The secondary action alongside a PrimaryButton: card fill, a defined
 * (not hairline) border, primary-colored text — enough presence to read as
 * a real button, without competing with the one primary action per screen.
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { useAppTheme } from '@/utils/colorSystem';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function SecondaryButton({ label, onPress, disabled }: SecondaryButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[
        styles.button,
        { backgroundColor: colors.card, borderColor: colors.borderDefined, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TAP_TARGET,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
