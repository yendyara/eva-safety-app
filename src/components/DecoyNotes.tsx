/**
 * The decoy: a convincing, boring utility screen standing in for EVA.
 *
 * This exists because of a well-documented pattern in domestic abuse
 * situations — abusers frequently check a victim's phone, and an app that
 * visibly announces itself as a safety tool can escalate the exact danger
 * it exists to prevent. The decoy isn't a gimmick; it's a way for the app
 * to keep working without being detectable as what it is. Nothing here
 * hints at EVA — no EVA color, no EVA icon, no EVA copy is shared with the
 * real app.
 *
 * The label, icon, and color are entirely up to whoever sets this up —
 * there's no built-in "recipe app" or "period tracker" persona baked in.
 * A preset theme assumes something about who's using EVA and what would
 * plausibly be on their phone; letting the person fill in their own label
 * assumes nothing. The underlying shell stays a plain list layout (works
 * under "Notes," "Tasks," "Reminders," whatever they pick) rather than
 * trying to visually impersonate a specific kind of app.
 *
 * The way back in is a hidden triple-tap on the bottom-left corner. It's
 * deliberately undiscoverable by accident (a stray tap won't trigger it)
 * but fast to execute once you know the gesture, since re-entering EVA is
 * itself something that may need to happen quickly and unnoticed.
 */
import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const FAKE_ITEMS = [
  { id: '1', title: 'Grocery list', timestamp: '9:14 AM', preview: 'Milk, eggs, bread, coffee...' },
  { id: '2', title: 'Meeting notes - Monday', timestamp: 'Yesterday', preview: 'Follow up with team on...' },
  { id: '3', title: 'Wifi password', timestamp: 'Sat', preview: 'Guest network: ask at the front desk...' },
  { id: '4', title: 'Call the plumber', timestamp: 'Jul 14', preview: 'Ask about the leak upstairs...' },
];

const TAP_COUNT_TO_REVEAL = 3;
const TAP_WINDOW_MS = 1200;
const TAP_ZONE_SIZE = 64;

type DecoyNotesProps = {
  label: string;
  icon: string;
  color: string;
  onReveal: () => void;
};

export function DecoyNotes({ label, icon, color, onReveal }: DecoyNotesProps) {
  const tapCount = useRef(0);
  const lastTapAt = useRef(0);

  const handleCornerTap = () => {
    const now = Date.now();
    if (now - lastTapAt.current > TAP_WINDOW_MS) {
      tapCount.current = 0;
    }
    tapCount.current += 1;
    lastTapAt.current = now;

    if (tapCount.current >= TAP_COUNT_TO_REVEAL) {
      tapCount.current = 0;
      onReveal();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerIcon, { color }]}>{icon}</Text>
        <Text style={styles.header}>{label}</Text>
      </View>
      {FAKE_ITEMS.map((note) => (
        <View key={note.id} style={styles.noteRow}>
          <View style={styles.noteText}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.notePreview} numberOfLines={1}>
              {note.timestamp}  {note.preview}
            </Text>
          </View>
        </View>
      ))}

      {/* Unlabeled by design — any visible affordance here would defeat the point of a decoy. */}
      <Pressable
        accessible={false}
        onPress={handleCornerTap}
        style={styles.cornerTapZone}
      />
    </View>
  );
}

// The decoy intentionally does not use EVA's color tokens or theme system —
// it needs to look like a generic system app, not like EVA wearing a mask.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 28,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
  },
  noteRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
  },
  noteText: {
    gap: 2,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  notePreview: {
    fontSize: 15,
    color: '#8E8E93',
  },
  cornerTapZone: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: TAP_ZONE_SIZE,
    height: TAP_ZONE_SIZE,
  },
});
