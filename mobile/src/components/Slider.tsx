import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';

// En enkel dra-skala med − og + for finjustering. Fungerer med finger og mus.
export function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const trackRef = useRef<View>(null);
  const [trackLeft, setTrackLeft] = useState(0);
  const [trackWidth, setTrackWidth] = useState(1);
  // Under draget vises verdien med en gang, men den sendes videre først når du
  // slipper. Ellers krymper lista mens du drar, siden ruller og draget avbrytes.
  const [dragValue, setDragValue] = useState<number | null>(null);
  const latest = useRef<number | null>(null);

  const clamp = (next: number) => Math.min(max, Math.max(min, Math.round(next / step) * step));
  const shown = dragValue ?? value;
  const fraction = (shown - min) / (max - min);

  function preview(next: number) {
    latest.current = next;
    setDragValue(next);
  }

  function commit() {
    if (latest.current !== null) onChange(latest.current);
    latest.current = null;
    setDragValue(null);
  }

  // I nettleseren kan vi måle skalaen med en gang. Da treffer også raske drag riktig.
  function domBox(): { left: number; width: number } | null {
    const node = trackRef.current as unknown as { getBoundingClientRect?: () => { left: number; width: number } } | null;
    if (!node?.getBoundingClientRect) return null;
    const rect = node.getBoundingClientRect();
    return rect.width > 0 ? { left: rect.left, width: rect.width } : null;
  }

  function fromEvent(event: GestureResponderEvent) {
    const box = domBox() ?? { left: trackLeft, width: trackWidth };
    const x = event.nativeEvent.pageX - box.left;
    preview(clamp(min + (x / box.width) * (max - min)));
  }

  function measure(event: GestureResponderEvent) {
    const pageX = event.nativeEvent.pageX;
    if (domBox()) {
      fromEvent(event);
      return;
    }
    trackRef.current?.measureInWindow((x, _y, width) => {
      setTrackLeft(x);
      setTrackWidth(Math.max(1, width));
      preview(clamp(min + ((pageX - x) / Math.max(1, width)) * (max - min)));
    });
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{format(shown)}</Text>
      </View>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mindre ${label.toLowerCase()}`}
          onPress={() => onChange(clamp(value - step))}
          style={styles.step}
          hitSlop={6}>
          <Ionicons name="remove" size={16} color={colors.ink} />
        </Pressable>
        <View
          ref={trackRef}
          style={styles.hitArea}
          onLayout={event => setTrackWidth(Math.max(1, event.nativeEvent.layout.width))}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={measure}
          onResponderMove={event => fromEvent(event)}
          onResponderRelease={commit}
          onResponderTerminate={commit}
          onResponderTerminationRequest={() => false}
          accessibilityRole="adjustable"
          accessibilityLabel={label}
          accessibilityValue={{ min, max, now: shown, text: format(shown) }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={event =>
            onChange(clamp(value + (event.nativeEvent.actionName === 'increment' ? step : -step)))
          }>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
          </View>
          <View style={[styles.thumb, { left: `${fraction * 100}%` }]} pointerEvents="none" />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mer ${label.toLowerCase()}`}
          onPress={() => onChange(clamp(value + step))}
          style={styles.step}
          hitSlop={6}>
          <Ionicons name="add" size={16} color={colors.ink} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  value: {
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    color: colors.ink,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: radius.round,
    backgroundColor: colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hitArea: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    cursor: 'pointer',
  } as object,
  track: {
    height: 6,
    borderRadius: radius.round,
    backgroundColor: colors.beigeDark,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.ink,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    borderRadius: radius.round,
    backgroundColor: colors.limeStrong,
    borderWidth: 2,
    borderColor: colors.ink,
  },
});
