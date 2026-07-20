/**
 * The decoy: a convincing, boring notes app standing in for EVA.
 *
 * This exists because of a well-documented pattern in domestic abuse
 * situations — abusers frequently check a victim's phone, and an app that
 * visibly announces itself as a safety tool can escalate the exact danger
 * it exists to prevent. The decoy isn't a gimmick; it's a way for the app
 * to keep working without being detectable as what it is. Nothing here
 * hints at EVA — no color, no icon, no copy is shared with the real app.
 *
 * The way back in is a hidden triple-tap on the bottom-left corner. It's
 * deliberately undiscoverable by accident (a stray tap won't trigger it)
 * but fast to execute once you know the gesture, since re-entering EVA is
 * itself something that may need to happen quickly and unnoticed.
 */
import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const FAKE_NOTES = [
  { id: '1', title: 'Grocery list', timestamp: '9:14 AM', preview: 'Milk, eggs, bread, coffee...' },
  { id: '2', title: 'Meeting notes - Monday', timestamp: 'Yesterday', preview: 'Follow up with team on...' },
  { id: '3', title: 'Recipe ideas', timestamp: 'Sat', preview: 'Try the lemon pasta again...' },
  { id: '4', title: 'Call the plumber', timestamp: 'Jul 14', preview: 'Ask about the leak upstairs...' },
];

const TAP_COUNT_TO_REVEAL = 3;
const TAP_WINDOW_MS = 1200;
const TAP_ZONE_SIZE = 64;

type DecoyNotesProps = {
  onReveal: () => void;
};

export function DecoyNotes({ onReveal }: DecoyNotesProps) {
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
      <Text style={styles.header}>Notes</Text>
      {FAKE_NOTES.map((note) => (
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
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
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
