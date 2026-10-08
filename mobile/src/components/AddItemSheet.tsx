import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Sheet } from '@/components/Sheet';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useMeals } from '@/lib/meals-store';
import { hitMeta, hitToProduct, useProductSearch, type SearchHit } from '@/lib/search';
import { useShopping, type ExtraItem } from '@/lib/shopping';

// Legg til varer rett i handlelista, som i Rema-appen: søk, trykk +, juster
// antall med − og +. Søket står åpent, så du kan legge inn flere på rad.
export function AddItemSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { state, addExtra, updateExtra } = useShopping();
  const { memberName } = useMeals();
  const addedBy = memberName.trim() || null;
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(1);
  const { hits, state: searchState } = useProductSearch(query);

  const extras = Object.values(state.extras).sort((a, b) => a.addedAt - b.addedAt);
  const extraFor = (ean: string) => extras.find(extra => extra.product?.ean === ean);

  function addFreeText() {
    const name = query.trim();
    if (!name) return;
    addExtra({ name: name[0].toUpperCase() + name.slice(1), quantity: count, unit: 'stk', product: null, addedBy });
    setQuery('');
    setCount(1);
  }

  function close() {
    setQuery('');
    setCount(1);
    onClose();
  }

  return (
    <Sheet visible={visible} onClose={close} eyebrow="Handleliste" title="Legg til vare">
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.inkSoft} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={addFreeText}
          placeholder="F.eks. melk, bleier, kaffe"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          autoFocus
          autoCorrect={false}
          returnKeyType="done"
          accessibilityLabel="Søk etter vare å legge til"
        />
        {searchState === 'loading' && <ActivityIndicator size="small" color={colors.inkSoft} />}
        {query.length > 0 && (
          <Pressable accessibilityLabel="Tøm søket" onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {query.trim().length > 0 && (
        <View style={styles.freeRow}>
          <Text style={styles.freeName} numberOfLines={1}>
            {query.trim()}
          </Text>
          <Counter
            value={count}
            unit="stk"
            label={query.trim()}
            onMinus={() => setCount(c => Math.max(1, c - 1))}
            onPlus={() => setCount(c => c + 1)}
          />
          <Pressable accessibilityRole="button" accessibilityLabel={`Legg til ${query.trim()}`} onPress={addFreeText} style={styles.freeButton}>
            <Text style={styles.freeButtonText}>Legg til</Text>
          </Pressable>
        </View>
      )}

      {searchState === 'no_key' && (
        <Text style={styles.note}>Varesøket er ikke slått på ennå. Skriv varen og trykk «Legg til».</Text>
      )}
      {searchState === 'error' && <Text style={styles.note}>Fikk ikke søkt akkurat nå. Du kan legge til som tekst.</Text>}

      {hits.slice(0, 10).map(hit => (
        <HitRow key={hit.ean} hit={hit} extra={extraFor(hit.ean)} onAdd={() => addExtra({ name: hit.name, quantity: 1, unit: 'pk', product: hitToProduct(hit), addedBy })} onChange={updateExtra} />
      ))}

      {extras.length > 0 && (
        <View style={styles.added}>
          <Text style={styles.addedTitle}>Lagt til i lista ({extras.length})</Text>
          {extras.map(extra => (
            <View key={extra.id} style={styles.addedRow}>
              <Text style={styles.addedName} numberOfLines={1}>
                {extra.name}
              </Text>
              <Counter
                value={extra.quantity}
                unit={extra.unit}
                label={extra.name}
                onMinus={() => updateExtra(extra.id, { quantity: extra.quantity - 1 })}
                onPlus={() => updateExtra(extra.id, { quantity: extra.quantity + 1 })}
              />
            </View>
          ))}
        </View>
      )}
    </Sheet>
  );
}

function HitRow({
  hit,
  extra,
  onAdd,
  onChange,
}: {
  hit: SearchHit;
  extra: ExtraItem | undefined;
  onAdd: () => void;
  onChange: (id: string, change: { quantity: number }) => void;
}) {
  return (
    <View style={styles.hit}>
      <View style={styles.hitImage}>
        {hit.image ? (
          <Image source={{ uri: hit.image }} style={StyleSheet.absoluteFill} contentFit="contain" />
        ) : (
          <Ionicons name="cube-outline" size={22} color={colors.muted} />
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
      {extra ? (
        <Counter
          value={extra.quantity}
          label={hit.name}
          onMinus={() => onChange(extra.id, { quantity: extra.quantity - 1 })}
          onPlus={() => onChange(extra.id, { quantity: extra.quantity + 1 })}
        />
      ) : (
        <Pressable accessibilityRole="button" accessibilityLabel={`Legg til ${hit.name}`} onPress={onAdd} style={styles.addButton}>
          <Ionicons name="add" size={22} color={colors.ink} />
        </Pressable>
      )}
    </View>
  );
}

export function Counter({
  value,
  unit,
  label,
  onMinus,
  onPlus,
}: {
  value: number;
  unit?: string;
  label: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.counter}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Færre ${label}`} onPress={onMinus} style={styles.counterButton} hitSlop={4}>
        <Ionicons name="remove" size={16} color={colors.ink} />
      </Pressable>
      <Text style={styles.counterValue}>
        {String(value).replace('.', ',')}
        {unit ? ` ${unit}` : ''}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Flere ${label}`} onPress={onPlus} style={styles.counterButton} hitSlop={4}>
        <Ionicons name="add" size={16} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: spacing.md,
    outlineStyle: 'none',
  } as object,
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  freeName: {
    flex: 1,
    minWidth: 100,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.ink,
  },
  freeButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  freeButtonText: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.bg,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
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
    width: 52,
    height: 52,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: colors.limeStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.beige,
    borderRadius: radius.round,
  },
  counterButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    minWidth: 40,
    textAlign: 'center',
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    color: colors.ink,
  },
  added: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  addedTitle: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  addedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  addedName: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
});
