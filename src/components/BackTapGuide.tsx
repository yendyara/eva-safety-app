/**
 * The guided setup for triggering EVA via Back Tap or a Siri Shortcut,
 * without ever opening the app. Shared between Settings and the onboarding
 * step so the instructions and actions only need to be written once.
 *
 * iOS gives no way for an app to pre-fill a Shortcut's steps or register
 * itself with Back Tap directly — this is the closest thing to automatic
 * that's actually possible: the link is generated and copied for the
 * person, and each button jumps straight to the right screen instead of
 * making them search for it.
 */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLink } from '@/components/TextLink';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { copyQuickAlertLink, openBackTapSettings, openShortcutsApp } from '@/utils/backTapSetup';
import { useAppTheme } from '@/utils/colorSystem';

const STEPS = [
  '1. Copy the alert link below.',
  '2. Open the Shortcuts app, create a new shortcut, and add an "Open URL" action with that link.',
  '3. Open Back Tap settings, choose double or triple tap, and select your new shortcut.',
];

type BackTapGuideProps = {
  /** Label for the main deep-link action — varies slightly between onboarding and Settings copy. */
  primaryLabel: string;
};

export function BackTapGuide({ primaryLabel }: BackTapGuideProps) {
  const { colors } = useAppTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyQuickAlertLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.steps}>
        {STEPS.map((step) => (
          <Text key={step} style={[Typography.body, { color: colors.textSecondary }]}>
            {step}
          </Text>
        ))}
      </View>

      <View style={styles.linkRow}>
        <TextLink
          label={copied ? 'Copied!' : 'Copy alert link'}
          onPress={handleCopy}
          colorToken="textSecondary"
        />
        <TextLink label="Open Shortcuts app" onPress={openShortcutsApp} colorToken="textSecondary" />
      </View>

      <PrimaryButton label={primaryLabel} onPress={openBackTapSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  steps: {
    gap: Spacing.xs,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
