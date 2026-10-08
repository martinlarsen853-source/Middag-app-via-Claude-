import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useLayout } from '@/lib/layout';

// Et ark som legger seg over siden, som søket i Rema-appen. På mobil fyller det
// nesten hele skjermen med søkefeltet øverst, så tastaturet aldri dekker det.
export function Sheet({
  visible,
  onClose,
  title,
  eyebrow,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const { wide } = useLayout();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType={wide ? 'fade' : 'slide'} onRequestClose={onClose}>
      <View style={[styles.backdrop, wide && styles.backdropWide]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Lukk" />
        <View
          style={[
            styles.card,
            wide ? styles.cardWide : [styles.cardNarrow, { marginTop: insets.top + spacing.xl, paddingBottom: insets.bottom }],
          ]}
          accessibilityViewIsModal>
          <View style={styles.header}>
            <View style={styles.headerText}>
              {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            </View>
            <Pressable accessibilityRole="button" onPress={onClose} hitSlop={10} style={styles.done}>
              <Text style={styles.doneText}>Ferdig</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(13, 43, 5, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropWide: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  card: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  cardNarrow: {
    flex: 1,
  },
  cardWide: {
    width: 600,
    maxWidth: '100%',
    height: '80%',
    borderRadius: radius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 28,
    color: colors.ink,
  },
  done: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.round,
    backgroundColor: colors.ink,
  },
  doneText: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.bg,
  },
  body: {
    padding: spacing.xl,
    gap: spacing.md,
  },
});
