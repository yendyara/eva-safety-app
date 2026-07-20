/**
 * The panic button: a 3-second press-and-hold, not a tap.
 *
 * A single tap is the fastest possible trigger, but it's also the easiest
 * to fire by accident — brushing a pocket, a child grabbing the phone, a
 * reflexive touch. A hold requires sustained, deliberate contact, which is
 * exactly what a false alarm lacks and what a genuine emergency still
 * allows for: research on stress response and motor control under duress
 * shows that gross motor actions (keep a thumb pressed down) survive acute
 * stress far better than fine or precisely-timed ones. Three seconds is the
 * balance point — short enough to complete while genuinely panicking, long
 * enough that an accidental brush won't complete it.
 *
 * The terracotta arc filling in around the button is the only feedback
 * during the hold. It answers "is this working?" without needing text,
 * which matters because reading comprehension also narrows under stress.
 */
import React, { useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useAppTheme } from '@/utils/colorSystem';

const HOLD_DURATION_MS = 3000;
const BUTTON_DIAMETER = 220;
const STROKE_WIDTH = 6;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type PanicButtonProps = {
  onTrigger: () => void;
};

export function PanicButton({ onTrigger }: PanicButtonProps) {
  const { colors } = useAppTheme();
  // Animated.Value lives in useState rather than useRef: `.interpolate()`
  // below runs during render, and the React Compiler (on for this project)
  // forbids reading ref.current during render. A lazy useState initializer
  // still creates the value exactly once and is mutated imperatively from
  // then on, same as a ref would be — it just satisfies the compiler.
  const [progress] = useState(() => new Animated.Value(0));
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  const radius = (BUTTON_DIAMETER - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const handlePressIn = (_event: GestureResponderEvent) => {
    setIsHolding(true);
    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false, // strokeDashoffset isn't a native-driver-supported property
    });
    animationRef.current.start(({ finished }) => {
      if (finished) {
        onTrigger();
      }
    });
  };

  const handlePressOut = () => {
    setIsHolding(false);
    // Releasing early cancels the hold — the arc eases back to empty rather
    // than snapping, so letting go doesn't feel like an error state.
    animationRef.current?.stop();
    Animated.timing(progress, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel="Hold for three seconds to send an alert to your trusted contacts"
      hitSlop={12}
      style={styles.touchArea}
    >
      <View
        style={[
          styles.buttonBase,
          { backgroundColor: colors.primary },
          // A slight scale-down while held gives immediate tactile
          // confirmation that the press registered, independent of the arc.
          isHolding && styles.buttonBasePressed,
        ]}
      >
        <Text style={[styles.label, { color: colors.onPrimary }]}>Hold for help</Text>
      </View>
      <Svg
        width={BUTTON_DIAMETER}
        height={BUTTON_DIAMETER}
        // Rotate the whole SVG via a plain style transform (rather than the
        // Circle's own rotation/origin props) so the arc starts at 12
        // o'clock on every platform, including web, without relying on
        // react-native-svg's native-only transform attribute handling.
        style={[styles.arcOverlay, styles.arcRotation]}
        pointerEvents="none"
      >
        <AnimatedCircle
          cx={BUTTON_DIAMETER / 2}
          cy={BUTTON_DIAMETER / 2}
          r={radius}
          stroke={colors.accent}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    width: BUTTON_DIAMETER,
    height: BUTTON_DIAMETER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBase: {
    width: BUTTON_DIAMETER - STROKE_WIDTH * 2,
    height: BUTTON_DIAMETER - STROKE_WIDTH * 2,
    borderRadius: BUTTON_DIAMETER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBasePressed: {
    transform: [{ scale: 0.97 }],
  },
  arcOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  arcRotation: {
    transform: [{ rotate: '-90deg' }],
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
});
