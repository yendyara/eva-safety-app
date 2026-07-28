/**
 * The decoy mode toggle and customization form — an enable switch, plus
 * (once enabled) a label, an icon picker, and a color picker with a live
 * preview. Shared between Settings and the onboarding decoy step so the
 * exact same editing logic and storage writes back either place.
 */
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { DECOY_COLOR_OPTIONS, DECOY_ICON_OPTIONS } from '@/constants/decoyOptions';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { DecoySettings } from '@/utils/storage';

export function DecoyEditor() {
  const { colors, settings, updateSettings } = useAppTheme();
  const decoy = settings.decoy;

  const update = (partial: Partial<DecoySettings>) => {
    updateSettings({ decoy: { ...decoy, ...partial } });
  };

  return (
    <View style={styles.decoyEditor}>
      <View style={styles.decoyToggleRow}>
        <Text style={[Typography.body, { color: colors.textPrimary }]}>Enable decoy mode</Text>
        <Switch
          value={decoy.enabled}
          onValueChange={(value) => update({ enabled: value })}
          trackColor={{ false: colors.borderDefined, true: colors.accent }}
        />
      </View>

      {decoy.enabled && (
        <>
          <TextInput
            value={decoy.label}
            onChangeText={(text) => update({ label: text })}
            placeholder="Label (e.g. Notes, Tasks, Weather)"
            placeholderTextColor={colors.textSecondary}
            style={[styles.decoyInput, { color: colors.textPrimary, borderColor: colors.borderDefined }]}
          />

          <View style={styles.decoyOptionRow}>
            {DECOY_ICON_OPTIONS.map((icon) => {
              const isSelected = decoy.icon === icon;
              return (
                <Pressable
                  key={icon}
                  onPress={() => update({ icon })}
                  accessibilityRole="button"
                  style={[
                    styles.decoyIconOption,
                    { borderColor: isSelected ? colors.primary : colors.borderDefined },
                  ]}
                >
                  <Text style={styles.decoyIconGlyph}>{icon}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.decoyOptionRow}>
            {DECOY_COLOR_OPTIONS.map((color) => {
              const isSelected = decoy.color === color;
              return (
                <Pressable
                  key={color}
                  onPress={() => update({ color })}
                  accessibilityRole="button"
                  style={[
                    styles.decoyColorSwatch,
                    { backgroundColor: color },
                    isSelected && { borderColor: colors.textPrimary, borderWidth: 3 },
                  ]}
                />
              );
            })}
          </View>

          <View style={[styles.decoyPreview, { borderColor: colors.borderDefined }]}>
            <Text style={[styles.decoyIconGlyph, { color: decoy.color }]}>{decoy.icon}</Text>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>
              {decoy.label.trim() || 'Untitled'}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  decoyEditor: {
    gap: Spacing.md,
  },
  decoyToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: MIN_TAP_TARGET,
  },
  decoyInput: {
    minHeight: MIN_TAP_TARGET,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  decoyOptionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  decoyIconOption: {
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decoyIconGlyph: {
    fontSize: 22,
  },
  decoyColorSwatch: {
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    borderRadius: MIN_TAP_TARGET,
  },
  decoyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: 12,
  },
});
