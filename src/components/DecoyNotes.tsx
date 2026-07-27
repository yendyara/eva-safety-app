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
 * itself something that may need to happen quickly and unnoticed. The zone
 * is a generous chunk of the bottom-left quadrant rather than a small box —
 * it's invisible either way, so there's no cost to making it forgiving, and
 * a lot to gain: someone under stress shouldn't need to land three taps on
 * a pinpoint target. It also sits a few points above the screen's bottom
 * edge rather than flush against it — right at the very edge it competed
 * with iOS's edge-swipe-home gesture, which could eat the tap before it
 * ever reached this view.
 *
 * The same zone also answers a 3-second press-and-hold — identical
 * threshold to the real panic button (see PanicButton's HOLD_DURATION_MS) —
 * by sending the alert directly, without ever revealing Home. That's a
 * deliberate design choice, not a shortcut: a held touch can't survive a
 * screen navigation (the underlying view tears down mid-gesture and the OS
 * drops the touch), so "reveal Home, then keep holding its button" can't
 * carry over elapsed time the way it seems like it should. Running the
 * whole 3 seconds in one place, on one timer, sidesteps that entirely —
 * nothing is ever reset, because nothing ever restarts.
 */
import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HOLD_DURATION_MS } from '@/components/PanicButton';

const FAKE_ITEMS = [
  { id: '1', title: 'Grocery list', timestamp: '9:14 AM', preview: 'Milk, eggs, bread, coffee...' },
  { id: '2', title: 'Meeting notes - Monday', timestamp: 'Yesterday', preview: 'Follow up with team on...' },
  { id: '3', title: 'Wifi password', timestamp: 'Sat', preview: 'Guest network: ask at the front desk...' },
  { id: '4', title: 'Call the plumber', timestamp: 'Jul 14', preview: 'Ask about the leak upstairs...' },
];

const TAP_COUNT_TO_REVEAL = 3;
const TAP_WINDOW_MS = 1200;
const TAP_ZONE_WIDTH = '55%';
const TAP_ZONE_HEIGHT = '30%';
const TAP_ZONE_BOTTOM_OFFSET = 8;

type DecoyNotesProps = {
  label: string;
  icon: string;
  color: string;
  /** Triple-tap: a casual, unhurried return to Home. */
  onReveal: () => void;
  /** 3-second hold: send the real alert without ever revealing Home. */
  onEmergencyHold: () => void;
};

export function DecoyNotes({ label, icon, color, onReveal, onEmergencyHold }: DecoyNotesProps) {
  const tapCount = useRef(0);
  const lastTapAt = useRef(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdFired = useRef(false);

  const registerTap = () => {
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

  const handlePressIn = () => {
    holdFired.current = false;
    holdTimer.current = setTimeout(() => {
      holdFired.current = true;
      onEmergencyHold();
    }, HOLD_DURATION_MS);
  };

  const handlePressOut = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    // A release before the hold completes counts as one tap toward the
    // reveal gesture; a release after it already fired needs no follow-up.
    if (!holdFired.current) {
      registerTap();
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
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
    bottom: TAP_ZONE_BOTTOM_OFFSET,
    width: TAP_ZONE_WIDTH,
    height: TAP_ZONE_HEIGHT,
  },
});
