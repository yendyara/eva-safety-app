/**
 * Settings — trusted contacts, regional defaults, appearance, and About.
 *
 * The About section is treated as a real part of the product rather than
 * legal boilerplate. This is a portfolio piece as much as it's a safety
 * tool, and the reasoning behind every color, timing, and copy choice only
 * has value if someone can actually find it — so it's one tap from Home,
 * not buried in a README.
 */
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTapGuide } from '@/components/BackTapGuide';
import { ContactForm } from '@/components/ContactForm';
import { DECOY_COLOR_OPTIONS, DECOY_ICON_OPTIONS } from '@/constants/decoyOptions';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import {
  ActivationMethod,
  CoordinateFormat,
  DecoySettings,
  EmergencyRegion,
  ThemeMode,
  TrustedContact,
  getContacts,
  saveContacts,
} from '@/utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, settings, updateSettings } = useAppTheme();
  const [contacts, setContacts] = useState<TrustedContact[]>([]);

  useEffect(() => {
    getContacts().then(setContacts);
  }, []);

  const handleContactsChange = (next: TrustedContact[]) => {
    setContacts(next);
    saveContacts(next.filter((c) => c.name.trim() || c.phone.trim()));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.backButton}
        >
          <Text style={[styles.backArrow, { color: colors.textPrimary }]}>←</Text>
        </Pressable>
        <Text style={[Typography.heading, { color: colors.textPrimary }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Trusted contacts" colors={colors}>
          <Text
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/contacts-picker', params: { returnTo: '/settings' } })
            }
            style={[Typography.body, styles.importLink, { color: colors.accent }]}
          >
            Import from contacts
          </Text>
          <ContactForm contacts={contacts} onChange={handleContactsChange} />
        </Section>

        <Section title="Activation method" colors={colors}>
          <SegmentedToggle
            options={[
              { value: 'hold', label: 'On-screen button' },
              { value: 'volume', label: 'Volume button' },
            ]}
            value={settings.activationMethod}
            onChange={(value) => updateSettings({ activationMethod: value as ActivationMethod })}
          />
        </Section>

        <Section title="Trigger without opening the app" colors={colors}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            Back Tap lets you send an alert by tapping the back of your phone
            twice or three times — no unlocking, no opening EVA. It works
            through a Shortcut you set up once; here’s the fastest path.
          </Text>
          <BackTapGuide primaryLabel="Open Back Tap Settings" />
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            Once that’s set up, you can also remove the EVA icon from your
            Home Screen entirely: long-press the icon, choose “Remove from
            Home Screen,” and keep it in your App Library only. EVA keeps
            working — it just never has to be visible.
          </Text>
        </Section>

        <Section title="Decoy mode" colors={colors}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            Off by default. If you turn it on, choosing the × on Home
            instantly swaps EVA for a plain screen you design — your own
            label, icon, and color, not a pre-built theme. Triple-tap the
            bottom-left corner of that screen to return to EVA.
          </Text>
          <DecoyEditor />
        </Section>

        <Section title="Emergency number" colors={colors}>
          <SegmentedToggle
            options={[
              { value: 'EU', label: 'EU · 112' },
              { value: 'US', label: 'US · 911' },
            ]}
            value={settings.emergencyRegion}
            onChange={(value) => updateSettings({ emergencyRegion: value as EmergencyRegion })}
          />
        </Section>

        <Section title="Coordinates format" colors={colors}>
          <SegmentedToggle
            options={[
              { value: 'decimal', label: 'Decimal degrees' },
              { value: 'dms', label: 'Degrees / min / sec' },
            ]}
            value={settings.coordinateFormat}
            onChange={(value) => updateSettings({ coordinateFormat: value as CoordinateFormat })}
          />
        </Section>

        <Section title="Appearance" colors={colors}>
          <SegmentedToggle
            options={[
              { value: 'system', label: 'Follow system' },
              { value: 'light', label: 'Always light' },
              { value: 'dark', label: 'Always dark' },
            ]}
            value={settings.themeMode}
            onChange={(value) => updateSettings({ themeMode: value as ThemeMode })}
          />
        </Section>

        <Section title="About EVA" colors={colors}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            EVA is named for the archetype of the original protector — Eve, the first
            mother, the origin of protection. The app began as a concept aimed at women,
            with fuchsia as its identity color. As the product’s scope grew to serve
            anyone experiencing domestic abuse regardless of gender, the palette evolved
            with it — from fuchsia into warm amber and terracotta, keeping the same
            warmth and boldness while becoming more universal. Every choice in this app,
            from the 3-second hold to the decoy screen, is built around one idea: a
            steady hand in a moment that doesn’t feel steady at all.
          </Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  colors,
  children,
}: {
  title: string;
  colors: { textPrimary: string; border: string };
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.section, { borderColor: colors.border }]}>
      <Text style={[Typography.label, styles.sectionTitle, { color: colors.textPrimary }]}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function DecoyEditor() {
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
          trackColor={{ false: colors.border, true: colors.accent }}
        />
      </View>

      {decoy.enabled && (
        <>
          <TextInput
            value={decoy.label}
            onChangeText={(text) => update({ label: text })}
            placeholder="Label (e.g. Notes, Tasks, Weather)"
            placeholderTextColor={colors.textSecondary}
            style={[styles.decoyInput, { color: colors.textPrimary, borderColor: colors.border }]}
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
                    { borderColor: isSelected ? colors.primary : colors.border },
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

          <View style={[styles.decoyPreview, { borderColor: colors.border }]}>
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

function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            style={[
              styles.segmentedOption,
              {
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                Typography.label,
                { color: isSelected ? colors.onPrimary : colors.textSecondary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  backButton: {
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
  },
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
  importLink: {
    minHeight: MIN_TAP_TARGET,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  segmentedOption: {
    minHeight: MIN_TAP_TARGET,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
