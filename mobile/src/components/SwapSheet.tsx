import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Sheet } from '@/components/Sheet';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { substitutesFor } from '@/data/substitutes';
import { hitMeta, hitToProduct, useProductSearch } from '@/lib/search';
import { useShopping, type ListLine } from '@/lib/shopping';

// Butikken har ikke varen? Bytt til noe som passer i retten, finn en annen vare,
// eller hopp over den.
export function SwapSheet({ line, onClose }: { line: ListLine | null; onClose: () => void }) {
  const { swapLine, skipLine } = useShopping();
  const [query, setQuery] = useState('');
  const [freeText, setFreeText] = useState('');
  const { hits, state: searchState } = useProductSearch(line ? query : '');

  useEffect(() => {
    setQuery(line?.originalName ?? '');
    setFreeText('');
  }, [line?.key]);

  if (!line) return null;
  const suggestions = substitutesFor(line.originalName);

  function choose(name: string, product: ReturnType<typeof hitToProduct> | null = null) {
    if (!line) return;
    swapLine(line.key, { name, product });
    onClose();
  }

  return (
    <Sheet visible onClose={onClose} eyebrow="Har ikke butikken den?" title={`Bytt ut ${line.originalName}`}>
      {line.swapped && (
        <View style={styles.current}>
          <Text style={styles.currentText} numberOfLines={2}>
            Byttet til {line.name}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              swapLine(line.key, null);
              onClose();
            }}>
            <Text style={styles.link}>Angre bytte</Text>
          </Pressable>
        </View>
      )}

      {suggestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passer like godt</Text>
          {suggestions.map(option => (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={`Bytt til ${option}`}
              onPress={() => choose(option)}
              style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [
                styles.option,
                (hovered || pressed) && styles.optionActive,
              ]}>
              <Ionicons name="swap-horizontal" size={18} color={colors.ink} />
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skriv noe annet</Text>
        <View style={styles.freeRow}>
          <TextInput
            value={freeText}
            onChangeText={setFreeText}
            onSubmitEditing={() => freeText.trim() && choose(freeText.trim())}
            placeholder="Det du fant i stedet"
            placeholderTextColor={colors.muted}
            style={styles.input}
            accessibilityLabel="Skriv erstatning"
          />
          <Pressable
            accessibilityRole="button"
            disabled={!freeText.trim()}
            onPress={() => choose(freeText.trim())}
            style={[styles.useButton, !freeText.trim() && { opacity: 0.4 }]}>
            <Text style={styles.useButtonText}>Bruk</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Andre varer</Text>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.inkSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Søk etter vare"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            autoCorrect={false}
            accessibilityLabel="Søk etter annen vare"
          />
          {searchState === 'loading' && <ActivityIndicator size="small" color={colors.inkSoft} />}
        </View>
        {searchState === 'no_key' && <Text style={styles.note}>Varesøket er ikke slått på ennå.</Text>}
        {hits.slice(0, 6).map(hit => (
          <Pressable
            key={hit.ean}
            accessibilityRole="button"
            accessibilityLabel={`Bytt til ${hit.name}`}
            onPress={() => choose(hit.name, hitToProduct(hit))}
            style={styles.hit}>
            <View style={styles.hitImage}>
              {hit.image ? (
                <Image source={{ uri: hit.image }} style={StyleSheet.absoluteFill} contentFit="contain" />
              ) : (
                <Ionicons name="cube-outline" size={20} color={colors.muted} />
              )}
            </View>
            <View style={styles.hitText}>
              <Text style={styles.hitName} numberOfLines={2}>
                {hit.name}
              </Text>
              <Text style={styles.hitMeta} numberOfLines={1}>
                {hitMeta(hit)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Hopp over ${line.originalName}`}
        onPress={() => {
          skipLine(line.key, true);
          onClose();
        }}
        style={styles.skip}>
        <Ionicons name="close-circle-outline" size={20} color={colors.danger} />
        <Text style={styles.skipText}>Butikken har det ikke – hopp over</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  currentText: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.ink,
  },
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.green,
    textDecorationLine: 'underline',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    marginTop: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  optionActive: {
    borderColor: colors.ink,
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
  freeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    minHeight: 48,
    outlineStyle: 'none',
  } as object,
  useButton: {
    justifyContent: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  useButtonText: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.bg,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: spacing.md,
    outlineStyle: 'none',
  } as object,
  note: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
  },
  hit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  hitImage: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  hitText: {
    flex: 1,
    gap: 2,
  },
  hitName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.ink,
  },
  hitMeta: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  skipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.danger,
  },
});
