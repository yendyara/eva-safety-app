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

import { BackTapGuide } from '@/components/BackTapGuide';
import { ContactForm } from '@/components/ContactForm';
import { DecoyEditor } from '@/components/DecoyEditor';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import {
  ActivationMethod,
  CoordinateFormat,
  EmergencyRegion,
  ThemeMode,
  TrustedContact,
  getContacts,
  markSetupStepComplete,
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
    const valid = next.filter((c) => c.name.trim() || c.phone.trim());
    saveContacts(valid);
    // Editing here counts the same as completing the onboarding step —
    // whichever screen someone actually adds a contact from.
    if (valid.length > 0) markSetupStepComplete('contacts');
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
            style={[Typography.body, styles.importLink, { color: colors.progress }]}
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
            twice or three times. No unlocking. No opening eva. It works
            through a Shortcut you set up once. Here’s the fastest way.
          </Text>
          <BackTapGuide primaryLabel="Open Back Tap Settings" />
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            Once that’s set up, you can also remove the eva icon from your
            Home Screen. Long-press the icon, choose “Remove from Home
            Screen,” and keep it in your App Library only. I keep working. I
            just never have to be visible.
          </Text>
        </Section>

        <Section title="Decoy mode" colors={colors}>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            Off by default. If you turn it on, choosing the × on Home
            instantly swaps me for a plain screen you design. Your own
            label, icon, and color, not a pre-built theme. Triple-tap the
            bottom-left corner of that screen to bring me back.
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
            I’m named for the archetype of the original protector: Eve, the first
            mother, the origin of protection. I began as a concept aimed at women,
            with fuchsia as my identity color. As my scope grew to serve anyone
            experiencing domestic abuse, regardless of gender, my palette evolved
            with it, from fuchsia into warm amber and terracotta, keeping the same
            warmth and boldness while becoming more universal. Every part of me,
            from the 3-second hold to the decoy screen, is built around one idea.
            A steady hand in a moment that doesn’t feel steady at all.
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
  colors: { textPrimary: string; borderSubtle: string };
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.section, { borderColor: colors.borderSubtle }]}>
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
                borderColor: isSelected ? colors.primary : colors.borderSubtle,
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
