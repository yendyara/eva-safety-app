/**
 * Onboarding, screen 2 — Trusted Contacts.
 *
 * No sign-up, no account, nothing sent anywhere — contacts are written
 * straight to AsyncStorage on this device. An account is a record, and a
 * record is something that can be found. For someone whose safety depends
 * on an abuser not knowing this app exists, skipping account creation
 * isn't a convenience shortcut, it's the whole point: there is nothing to
 * discover outside the phone itself.
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContactForm } from '@/components/ContactForm';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { TrustedContact, saveContacts } from '@/utils/storage';

export default function OnboardingContactsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [contacts, setContacts] = useState<TrustedContact[]>([
    { id: 'contact-1', name: '', phone: '' },
  ]);

  const validContacts = contacts.filter((c) => c.name.trim() && c.phone.trim());
  const canSave = validContacts.length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    await saveContacts(validContacts);
    router.replace('/home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[Typography.heading, { color: colors.textPrimary }]}>
              Who should EVA call for you?
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Add up to 3 people. EVA will alert them if you need help.
            </Text>
          </View>

          <ContactForm contacts={contacts} onChange={setContacts} />
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton label="I'm ready" onPress={handleSave} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  header: {
    gap: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
