import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useLayout } from '@/lib/layout';

// Rullbar side med innholdet sentrert og begrenset i bredde, slik at det ser
// ordentlig ut på PC uten å strekke seg over hele skjermen.
export function Page({
  children,
  maxWidth,
  contentStyle,
}: {
  children: ReactNode;
  maxWidth?: number;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { gutter, contentWidth, wide } = useLayout();
  const insets = useSafeAreaInsets();
  const width = maxWidth ? Math.min(maxWidth, contentWidth) : contentWidth;
  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{
        paddingHorizontal: gutter,
        paddingTop: wide ? spacing.xxl : spacing.lg,
        paddingBottom: (wide ? spacing.xxxl : spacing.xl) + (wide ? insets.bottom : 0),
        alignItems: 'center',
      }}
      keyboardShouldPersistTaps="handled">
      <View style={[{ width }, contentStyle]}>{children}</View>
    </ScrollView>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function Title({ children, size = 'lg', style }: { children: ReactNode; size?: 'xl' | 'lg' | 'md' | 'sm'; style?: StyleProp<TextStyle> }) {
  const { wide } = useLayout();
  const sizes = wide ? { xl: 56, lg: 44, md: 30, sm: 24 } : { xl: 40, lg: 34, md: 26, sm: 22 };
  return (
    <Text accessibilityRole="header" style={[styles.title, { fontSize: sizes[size], lineHeight: sizes[size] * 1.05 }, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, style, numberOfLines }: { children: ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number }) {
  return (
    <Text style={[styles.body, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function Meta({ icon, children }: { icon?: keyof typeof Ionicons.glyphMap; children: ReactNode }) {
  return (
    <View style={styles.meta}>
      {icon && <Ionicons name={icon} size={14} color={colors.inkSoft} />}
      <Text style={styles.metaText}>{children}</Text>
    </View>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'lime' | 'outline';

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const palette = {
    primary: { bg: colors.ink, fg: colors.bg, border: colors.ink },
    secondary: { bg: colors.beige, fg: colors.ink, border: colors.beige },
    lime: { bg: colors.limeStrong, fg: colors.ink, border: colors.limeStrong },
    outline: { bg: 'transparent', fg: colors.ink, border: colors.ink },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border },
        (pressed || hovered) && !disabled && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
        style,
      ]}>
      {icon && <Ionicons name={icon} size={18} color={palette.fg} />}
      <Text style={[styles.buttonText, { color: palette.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function BackLink({ label, href }: { label: string; href: Href }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => (router.canGoBack() ? router.back() : router.replace(href))}
      style={styles.backLink}>
      <Ionicons name="arrow-back" size={16} color={colors.ink} />
      <Text style={styles.backLinkText}>{label}</Text>
    </Pressable>
  );
}

export function PersonStepper({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Færre personer"
        onPress={() => onChange(value - 1)}
        disabled={value <= 1}
        style={[styles.stepperButton, value <= 1 && { opacity: 0.35 }]}>
        <Ionicons name="remove" size={18} color={colors.ink} />
      </Pressable>
      <View style={styles.stepperValue}>
        <Text style={styles.stepperNumber}>{value}</Text>
        <Text style={styles.stepperLabel}>{value === 1 ? 'person' : 'personer'}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Flere personer"
        onPress={() => onChange(value + 1)}
        disabled={value >= 12}
        style={[styles.stepperButton, value >= 12 && { opacity: 0.35 }]}>
        <Ionicons name="add" size={18} color={colors.ink} />
      </Pressable>
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  eyebrow: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  title: {
    fontFamily: fonts.display,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkSoft,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.inkSoft,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  buttonText: {
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  backLinkText: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.ink,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    padding: 4,
    alignSelf: 'flex-start',
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingHorizontal: spacing.lg,
    minWidth: 112,
    justifyContent: 'center',
  },
  stepperNumber: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
  },
  stepperLabel: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.inkSoft,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.beige,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.lavender,
  },
  chipText: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    color: colors.ink,
  },
});
