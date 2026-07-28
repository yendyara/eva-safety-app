/**
 * A plain-text tappable link — used instead of a bordered button wherever
 * an action shouldn't compete visually with the screen's one primary
 * action. Keeps the visual hierarchy to a single obvious "main thing" per
 * screen, with secondary actions reading as lighter-weight by design.
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TAP_TARGET } from '@/constants/spacing';
import { ColorToken } from '@/constants/colors';
import { useAppTheme } from '@/utils/colorSystem';

type TextLinkProps = {
  label: string;
  onPress: () => void;
  /** Defaults to progress (terracotta) — pass 'textSecondary' for lower-emphasis links. */
  colorToken?: ColorToken;
};

export function TextLink({ label, onPress, colorToken = 'progress' }: TextLinkProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.touchArea}>
      <Text style={[styles.label, { color: colors[colorToken] }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    minHeight: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
