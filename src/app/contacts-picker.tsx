/**
 * Import trusted contacts from the device — with a safety screen first.
 *
 * Flow: request contacts permission → if denied (or unsupported, e.g. on
 * web) fall back to the existing manual-entry form, never block the rest
 * of the app → if granted, read the device contact list → run it through
 * a local, on-device keyword scan for likely partner/family matches (see
 * contactScreening.ts) → if any are found, show a gentle screening step
 * before the picker itself, so someone can rule out an abuser before ever
 * seeing them in a selectable list → then the searchable, alphabetical
 * picker.
 *
 * Nothing about a person's device contacts leaves this screen: no network
 * calls happen anywhere in this file.
 *
 * Reused from two places — onboarding step 3 and Settings — via a
 * `returnTo` param so this one screen doesn't need to know which flow it's
 * in. Screening re-runs every time this screen opens, per the safety
 * requirement that it isn't a one-time check.
 */
import * as Contacts from 'expo-contacts';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContactForm } from '@/components/ContactForm';
import { PrimaryButton } from '@/components/PrimaryButton';
import { MIN_TAP_TARGET, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAppTheme } from '@/utils/colorSystem';
import { ScreenableContact, ScreeningMatch, findRelationshipMatches } from '@/utils/contactScreening';
import {
  MAX_TRUSTED_CONTACTS,
  TrustedContact,
  excludeContacts,
  filterExcludedContacts,
  getContacts,
  markSetupStepComplete,
  normalizePhone,
  saveContacts,
} from '@/utils/storage';

type Phase = 'loading' | 'manual' | 'screening' | 'list';

type PickerContact = ScreenableContact;

function toPickerContacts(
  details: { id: string; fullName?: string | null; phones?: Contacts.ExistingPhone[] }[]
): PickerContact[] {
  const results: PickerContact[] = [];
  for (const detail of details) {
    const phone = detail.phones?.find((p) => p.number)?.number;
    const name = detail.fullName?.trim();
    if (!name || !phone) continue;
    results.push({
      id: detail.id,
      name,
      phone,
      labels: (detail.phones ?? []).map((p) => p.label ?? '').filter(Boolean),
    });
  }
  return results;
}

function groupAlphabetically(contacts: PickerContact[]): { title: string; data: PickerContact[] }[] {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  const groups = new Map<string, PickerContact[]>();
  for (const contact of sorted) {
    const letter = contact.name.trim().charAt(0).toUpperCase() || '#';
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(contact);
  }
  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}

export default function ContactsPickerScreen() {
  const router = useRouter();
  const { colors, settings } = useAppTheme();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const destination = (params.returnTo ?? '/home') as Href;

  const [phase, setPhase] = useState<Phase>('loading');
  const [existingContacts, setExistingContacts] = useState<TrustedContact[]>([]);
  const [poolContacts, setPoolContacts] = useState<PickerContact[]>([]);
  const [matches, setMatches] = useState<ScreeningMatch[]>([]);
  const [blockToggles, setBlockToggles] = useState<Record<string, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const existing = await getContacts();
      if (cancelled) return;
      setExistingContacts(existing);

      try {
        const permission = await Contacts.requestPermissionsAsync();
        if (!permission.granted) {
          if (!cancelled) setPhase('manual');
          return;
        }

        const details = await Contacts.Contact.getAllDetails(
          [Contacts.ContactField.FULL_NAME, Contacts.ContactField.PHONES],
          { sortOrder: Contacts.ContactsSortOrder.GivenName }
        );
        const withPhones = toPickerContacts(details);
        const visible = await filterExcludedContacts(withPhones);

        const found = findRelationshipMatches(visible);
        if (cancelled) return;

        if (found.length > 0) {
          setMatches(found);
          setBlockToggles(Object.fromEntries(found.map((m) => [m.contact.id, false])));
          setPoolContacts(visible);
          setPhase('screening');
        } else {
          setPoolContacts(visible);
          setPhase('list');
        }
      } catch {
        // expo-contacts isn't available (e.g. web) or the request otherwise
        // failed — never block the flow, just fall back to manual entry.
        if (!cancelled) setPhase('manual');
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const remainingSlots = Math.max(0, MAX_TRUSTED_CONTACTS - existingContacts.length);

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? poolContacts.filter((c) => c.name.toLowerCase().includes(query))
      : poolContacts;
    return groupAlphabetically(filtered);
  }, [poolContacts, search]);

  const emergencyLabel = settings.emergencyRegion === 'EU' ? '112' : '911';

  const toggleSelected = (contact: PickerContact) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(contact.id)) {
        next.delete(contact.id);
      } else if (next.size < remainingSlots) {
        next.add(contact.id);
      }
      return next;
    });
  };

  const finishScreening = async () => {
    const toExclude = matches
      .filter((m) => blockToggles[m.contact.id])
      .map((m) => ({ id: m.contact.id, name: m.contact.name, phone: m.contact.phone }));
    await excludeContacts(toExclude);

    const excludedPhones = new Set(toExclude.map((c) => normalizePhone(c.phone)));
    setPoolContacts((prev) => prev.filter((c) => !excludedPhones.has(normalizePhone(c.phone))));
    setPhase('list');
  };

  const finishList = async () => {
    const chosen = poolContacts.filter((c) => selectedIds.has(c.id));
    const merged = [...existingContacts, ...chosen.map(({ id, name, phone }) => ({ id, name, phone }))];
    await saveContacts(merged); // hard-filters excluded numbers internally
    await markSetupStepComplete('contacts'); // reached with ≥1 selected, per the Save button's disabled state
    router.replace(destination);
  };

  const finishManual = async (contacts: TrustedContact[]) => {
    const valid = contacts.filter((c) => c.name.trim() && c.phone.trim());
    await saveContacts(valid);
    await markSetupStepComplete('contacts'); // reached with ≥1 valid entry, per the Save button's disabled state
    router.replace(destination);
  };

  if (phase === 'loading') {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (phase === 'manual') {
    return <ManualFallback onSave={finishManual} />;
  }

  if (phase === 'screening') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <TopBar onBack={() => router.back()} />
        <View style={styles.screeningContent}>
          <Text style={[Typography.heading, { color: colors.textPrimary }]}>
            One moment
          </Text>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>
            We found some contacts that might be people close to you. Would
            you like to make sure they don’t receive any alerts or
            notifications from this app?
          </Text>

          <View style={styles.matchList}>
            {matches.map(({ contact, matchedKeyword }) => (
              <View key={contact.id} style={[styles.matchRow, { borderColor: colors.border }]}>
                <View style={styles.matchText}>
                  <Text style={[Typography.body, { color: colors.textPrimary }]}>{contact.name}</Text>
                  <Text style={[Typography.label, { color: colors.textSecondary }]}>
                    Matches “{matchedKeyword}”
                  </Text>
                </View>
                <Switch
                  value={blockToggles[contact.id] ?? false}
                  onValueChange={(value) =>
                    setBlockToggles((prev) => ({ ...prev, [contact.id]: value }))
                  }
                  trackColor={{ false: colors.border, true: colors.accent }}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Continue" onPress={finishScreening} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar onBack={() => router.back()} />

      <View style={styles.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.textPrimary, borderColor: colors.border }]}
        />
      </View>

      {remainingSlots === 0 && (
        <Text style={[Typography.label, styles.capNotice, { color: colors.textSecondary }]}>
          You already have {MAX_TRUSTED_CONTACTS} trusted contacts. Remove one
          in Settings to add another.
        </Text>
      )}

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        ListHeaderComponent={
          <View style={[styles.pinnedRow, { borderColor: colors.border }]}>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>Emergency · {emergencyLabel}</Text>
            <Text style={[Typography.label, { color: colors.textSecondary }]}>Always available</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { backgroundColor: colors.background, color: colors.textSecondary }]}>
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => {
          const isSelected = selectedIds.has(item.id);
          const disabled = !isSelected && remainingSlots === 0;
          return (
            <Pressable
              onPress={() => toggleSelected(item)}
              disabled={disabled}
              style={[styles.contactRow, { opacity: disabled ? 0.4 : 1 }]}
            >
              <View>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={[Typography.label, { color: colors.textSecondary }]}>{item.phone}</Text>
              </View>
              <Text style={[styles.toggleGlyph, { color: isSelected ? colors.accent : colors.textSecondary }]}>
                {isSelected ? '✓' : '+'}
              </Text>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <PrimaryButton label="Save" onPress={finishList} disabled={selectedIds.size === 0} />
      </View>
    </SafeAreaView>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.topBar}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.backButton}
      >
        <Text style={[styles.backArrow, { color: colors.textPrimary }]}>←</Text>
      </Pressable>
    </View>
  );
}

function ManualFallback({ onSave }: { onSave: (contacts: TrustedContact[]) => void }) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [contacts, setContacts] = useState<TrustedContact[]>([{ id: 'contact-1', name: '', phone: '' }]);
  const canSave = contacts.some((c) => c.name.trim() && c.phone.trim());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar onBack={() => router.back()} />
      <View style={styles.manualContent}>
        <Text style={[Typography.body, { color: colors.textSecondary }]}>
          We couldn’t access your contacts. You can add them manually.
        </Text>
        <ContactForm contacts={contacts} onChange={setContacts} />
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Save" onPress={() => onSave(contacts)} disabled={!canSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
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
  screeningContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  matchList: {
    gap: Spacing.md,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  matchText: {
    flex: 1,
    gap: 2,
  },
  searchWrap: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  searchInput: {
    minHeight: MIN_TAP_TARGET,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  capNotice: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  pinnedRow: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xs,
    fontSize: 13,
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    minHeight: MIN_TAP_TARGET,
  },
  toggleGlyph: {
    fontSize: 20,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  manualContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
