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
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContactForm } from '@/components/ContactForm';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import {
  CoordinateFormat,
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
          <ContactForm contacts={contacts} onChange={handleContactsChange} />
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
