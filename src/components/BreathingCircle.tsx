/**
 * A guided breathing pace: 4s in, 4s hold, 6s out, on loop.
 *
 * The exhale is deliberately the longest phase. Extending exhale relative
 * to inhale is a documented technique for engaging the parasympathetic
 * nervous system — it's the physiological lever that brings heart rate and
 * acute stress response down, not a stylistic choice. The circle's motion
 * mirrors the breath (expand to inhale, hold, contract to exhale) so the
 * pacing can be followed without reading anything.
 *
 * The stroke shifts to terracotta only on the exhale, echoing the same
 * color used for the panic button's hold arc — this is the one other
 * moment in the app that gets that "pay attention" color, because the
 * exhale is the one phase where attention actively helps the exercise work.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/utils/colorSystem';

const CIRCLE_MAX = 220;
const CIRCLE_MIN = 150;
const STROKE_WIDTH = 4;

type Phase = {
  key: 'inhale' | 'hold' | 'exhale';
  label: string;
  duration: number;
  toScale: number;
};

const PHASES: Phase[] = [
  { key: 'inhale', label: 'Breathe in', duration: 4000, toScale: 1 },
  { key: 'hold', label: 'Hold', duration: 4000, toScale: 1 },
  { key: 'exhale', label: 'Breathe out', duration: 6000, toScale: 0 },
];

export function BreathingCircle() {
  const { colors } = useAppTheme();
  const [label, setLabel] = useState(PHASES[0].label);
  // Animated.Values live in useState, not useRef — `.interpolate()` below
  // runs during render, and the React Compiler (on for this project)
  // forbids reading ref.current during render. Lazy useState initializers
  // still create each value exactly once and get mutated imperatively from
  // then on, same as refs would be — this just satisfies the compiler.
  const [scale] = useState(() => new Animated.Value(0));
  const [labelOpacity] = useState(() => new Animated.Value(0));
  const [strokeProgress] = useState(() => new Animated.Value(0)); // 0 = amber, 1 = terracotta
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const runPhase = (index: number) => {
      if (!isMounted.current) return;
      const phase = PHASES[index % PHASES.length];
      setLabel(phase.label);

      if (phase.key === 'inhale') {
        // Snap back to amber right as the next inhale begins, rather than
        // animating it — the circle is already at its smallest here, so the
        // color reset is invisible and the exhale's terracotta never lingers.
        strokeProgress.setValue(0);
      }

      labelOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(scale, {
          toValue: phase.toScale,
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        phase.key === 'exhale'
          ? Animated.timing(strokeProgress, {
              toValue: 1,
              duration: phase.duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false, // borderColor isn't native-driver-supported
            })
          : Animated.delay(phase.duration),
      ]).start(({ finished }) => {
        if (finished) runPhase(index + 1);
      });
    };

    runPhase(0);

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const diameter = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_MIN, CIRCLE_MAX],
  });
  const borderColor = strokeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.accent],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: diameter,
            height: diameter,
            borderRadius: CIRCLE_MAX,
            borderColor,
          },
        ]}
      />
      <Animated.Text style={[styles.label, { color: colors.textPrimary, opacity: labelOpacity }]}>
        {label}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CIRCLE_MAX,
  },
  circle: {
    position: 'absolute',
    borderWidth: STROKE_WIDTH,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
  },
});
