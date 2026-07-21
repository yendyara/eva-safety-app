/**
 * The trusted-contacts form, shared by onboarding and Settings.
 *
 * Capped at three contacts by design: the alert is meant to reach the small
 * circle of people who can actually act on it fast — a partner, a sibling,
 * a close friend — not become a broadcast list. Fewer recipients also means
 * fewer people who need to be told, later, exactly what happened.
 */
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { MAX_TRUSTED_CONTACTS, TrustedContact } from '@/utils/storage';

type ContactFormProps = {
  contacts: TrustedContact[];
  onChange: (contacts: TrustedContact[]) => void;
};

function createEmptyContact(): TrustedContact {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: '', phone: '' };
}

export function ContactForm({ contacts, onChange }: ContactFormProps) {
  const { colors } = useAppTheme();

  const updateContact = (id: string, field: 'name' | 'phone', value: string) => {
    onChange(contacts.map((contact) => (contact.id === id ? { ...contact, [field]: value } : contact)));
  };

  const removeContact = (id: string) => {
    onChange(contacts.filter((contact) => contact.id !== id));
  };

  const addContact = () => {
    if (contacts.length >= MAX_TRUSTED_CONTACTS) return;
    onChange([...contacts, createEmptyContact()]);
  };

  return (
    <View style={styles.container}>
      {contacts.map((contact, index) => (
        <View key={contact.id} style={[styles.row, { borderColor: colors.border }]}>
          <View style={styles.rowHeader}>
            <Text style={[Typography.label, { color: colors.textSecondary }]}>
              CONTACT {index + 1}
            </Text>
            <Text
              accessibilityRole="button"
              onPress={() => removeContact(contact.id)}
              style={[Typography.label, { color: colors.textSecondary }]}
            >
              Remove
            </Text>
          </View>
          <TextInput
            value={contact.name}
            onChangeText={(text) => updateContact(contact.id, 'name', text)}
            placeholder="Name"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            autoCapitalize="words"
          />
          <TextInput
            value={contact.phone}
            onChangeText={(text) => updateContact(contact.id, 'phone', text)}
            placeholder="Phone number"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            keyboardType="phone-pad"
          />
        </View>
      ))}

      {contacts.length < MAX_TRUSTED_CONTACTS && (
        <Text
          accessibilityRole="button"
          onPress={addContact}
          style={[styles.addContact, Typography.body, { color: colors.accent }]}
        >
          + Add contact
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  row: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    minHeight: MIN_TAP_TARGET,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  addContact: {
    paddingVertical: Spacing.sm,
    minHeight: MIN_TAP_TARGET,
  },
});
