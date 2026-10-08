import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackLink, Body, Button, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { displayAmount, mealBase } from '@/lib/meals';
import { useMeals } from '@/lib/meals-store';
import { useShopping } from '@/lib/shopping';
import { useApp } from '@/lib/store';

// Kokemodus: ett steg om gangen med stor tekst, så oppskriften kan leses fra
// benken. Skjermen holdes våken, og steg med minutter får en nedtelling.
export default function CookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { persons: defaultPersons } = useApp();
  const { findMeal } = useMeals();
  const { entryFor } = useShopping();
  const [index, setIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const awake = useWakeLock();
  const stepRef = useRef<View>(null);

  // Velger du et steg nederst, ruller vi opp til det store kortet.
  function jumpTo(next: number) {
    setIndex(next);
    const node = stepRef.current as unknown as { scrollIntoView?: (options: object) => void } | null;
    node?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }

  const meal = findMeal(id);
  const steps = meal?.steps ?? [];
  const done = index >= steps.length;

  // Piltastene blar på PC.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setIndex(i => Math.min(steps.length, i + 1));
      if (event.key === 'ArrowLeft') setIndex(i => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length]);

  if (!meal || steps.length === 0) {
    return (
      <Page maxWidth={720}>
        <BackLink label="Tilbake" href="/" />
        <Title size="md" style={{ marginTop: spacing.lg }}>
          {meal ? 'Denne retten har ingen steg' : 'Fant ikke retten'}
        </Title>
        <Body style={{ marginTop: spacing.sm }}>
          {meal ? 'Legg inn fremgangsmåten med «Endre» på oppskriften.' : 'Den kan ha blitt fjernet fra lista.'}
        </Body>
      </Page>
    );
  }

  const persons = entryFor(meal.id)?.persons ?? defaultPersons;
  const base = mealBase(meal);
  const step = steps[Math.min(index, steps.length - 1)];

  return (
    <Page maxWidth={760}>
      <BackLink label="Til oppskriften" href={`/rett/${meal.id}`} />
      <View style={styles.header}>
        <Eyebrow>Kokemodus · {persons} {persons === 1 ? 'person' : 'personer'}</Eyebrow>
        <Title size="lg">{meal.name}</Title>
      </View>

      <View ref={stepRef} style={styles.progressRow}>
        <Text style={styles.progressText}>{done ? 'Ferdig' : `Steg ${index + 1} av ${steps.length}`}</Text>
        {awake && (
          <View style={styles.awake}>
            <Ionicons name="sunny-outline" size={14} color={colors.inkSoft} />
            <Text style={styles.awakeText}>Skjermen holdes på</Text>
          </View>
        )}
      </View>
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${(Math.min(index + 1, steps.length) / steps.length) * 100}%` }]} />
      </View>

      {done ? (
        <View style={[styles.stepCard, styles.doneCard]}>
          <Ionicons name="happy-outline" size={44} color={colors.ink} />
          <Title size="lg">Velbekomme!</Title>
          <Body style={styles.center}>Alle stegene er gjort.</Body>
          <View style={styles.buttons}>
            <Button label="Se stegene igjen" icon="refresh" variant="outline" onPress={() => setIndex(0)} />
            <Button label="Til oppskriften" icon="arrow-forward" onPress={() => router.replace(`/rett/${meal.id}`)} />
          </View>
        </View>
      ) : (
        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>{index + 1}</Text>
          <Text style={styles.stepText} accessibilityLabel={`Steg ${index + 1}: ${step}`}>
            {step}
          </Text>
          <StepTimer key={index} text={step} />
        </View>
      )}

      {!done && (
        <View style={styles.nav}>
          <Button
            label="Forrige"
            icon="arrow-back"
            variant="outline"
            disabled={index === 0}
            onPress={() => setIndex(i => Math.max(0, i - 1))}
            style={styles.navButton}
          />
          <Button
            label={index === steps.length - 1 ? 'Ferdig' : 'Neste'}
            icon={index === steps.length - 1 ? 'checkmark' : 'arrow-forward'}
            onPress={() => setIndex(i => i + 1)}
            style={styles.navButton}
          />
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        aria-expanded={showIngredients}
        onPress={() => setShowIngredients(open => !open)}
        style={styles.toggle}>
        <Ionicons name="list-outline" size={18} color={colors.ink} />
        <Text style={styles.toggleText}>
          {showIngredients ? 'Skjul ingredienser' : `Vis ingredienser (${meal.ingredients.length})`}
        </Text>
        <Ionicons name={showIngredients ? 'chevron-up' : 'chevron-down'} size={18} color={colors.ink} />
      </Pressable>
      {showIngredients && (
        <View style={styles.ingredients}>
          {meal.ingredients.map((ingredient, i) => (
            <View key={`${ingredient.name}-${i}`} style={[styles.ingredientRow, i > 0 && styles.divider]}>
              <Text style={styles.amount}>{displayAmount(ingredient, persons, base)}</Text>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.overview}>
        <Eyebrow>Alle steg</Eyebrow>
        {steps.map((text, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            aria-selected={i === index}
            accessibilityLabel={`Gå til steg ${i + 1}`}
            onPress={() => jumpTo(i)}
            style={[styles.overviewRow, i === index && styles.overviewRowOn]}>
            <Text style={[styles.overviewNumber, i < index && styles.overviewDone]}>{i + 1}</Text>
            <Text style={[styles.overviewText, i < index && styles.overviewDone]} numberOfLines={2}>
              {text}
            </Text>
          </Pressable>
        ))}
      </View>
    </Page>
  );
}

// Holder skjermen våken i nettleseren (Screen Wake Lock) mens kokemodus er åpen.
function useWakeLock(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined') return;
    const wakeLock = (navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock;
    if (!wakeLock) return;
    let sentinel: { release: () => Promise<void> } | null = null;
    let stopped = false;
    const request = () =>
      wakeLock
        .request('screen')
        .then(lock => {
          if (stopped) lock.release().catch(() => {});
          else {
            sentinel = lock;
            setActive(true);
          }
        })
        .catch(() => setActive(false));
    // Låsen slippes når fanen skjules, så vi ber om den igjen når du er tilbake.
    const onVisible = () => {
      if (document.visibilityState === 'visible') request();
    };
    request();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', onVisible);
      sentinel?.release().catch(() => {});
    };
  }, []);
  return active;
}

// Finner «10 minutter» eller «8–10 min» i steget. Ved et spenn brukes det korteste,
// så du heller sjekker en gang for mye.
function minutesIn(text: string): number | null {
  const match = text.match(/(\d+)(?:\s*[-–]\s*\d+)?\s*(?:min\b|minutt)/i);
  if (!match) return null;
  const minutes = Number(match[1]);
  return minutes > 0 && minutes <= 240 ? minutes : null;
}

function StepTimer({ text }: { text: string }) {
  const minutes = minutesIn(text);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!endAt) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [endAt]);

  if (!minutes) return null;
  if (!endAt) {
    return (
      <Button
        label={`Start ${minutes} min`}
        icon="timer-outline"
        variant="lime"
        onPress={() => {
          setNow(Date.now());
          setEndAt(Date.now() + minutes * 60000);
        }}
        style={styles.timerButton}
      />
    );
  }
  const left = Math.max(0, Math.round((endAt - now) / 1000));
  const finished = left === 0;
  return (
    <View style={[styles.timer, finished && styles.timerDone]} accessibilityLiveRegion="polite">
      <Ionicons name={finished ? 'alarm' : 'timer-outline'} size={22} color={colors.ink} />
      <Text style={styles.timerText}>
        {finished ? 'Tiden er ute!' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}
      </Text>
      <Pressable accessibilityRole="button" onPress={() => setEndAt(null)} hitSlop={8}>
        <Text style={styles.timerReset}>{finished ? 'OK' : 'Stopp'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressText: {
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  awake: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  awakeText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkSoft,
  },
  progress: {
    height: 6,
    borderRadius: radius.round,
    backgroundColor: colors.beigeDark,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.green,
  },
  stepCard: {
    backgroundColor: colors.lime,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    minHeight: 240,
  },
  doneCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  stepNumber: {
    fontFamily: fonts.display,
    fontSize: 56,
    lineHeight: 56,
    color: colors.green,
  },
  stepText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 24,
    lineHeight: 34,
    color: colors.ink,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  nav: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  navButton: {
    flex: 1,
    minHeight: 56,
  },
  timerButton: {
    alignSelf: 'flex-start',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.round,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  timerDone: {
    backgroundColor: colors.limeStrong,
  },
  timerText: {
    fontFamily: fonts.monoMedium,
    fontSize: 20,
    color: colors.ink,
  },
  timerReset: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.green,
    textDecorationLine: 'underline',
    marginLeft: spacing.sm,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  toggleText: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.ink,
  },
  ingredients: {
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.beigeDark,
  },
  amount: {
    width: 88,
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    lineHeight: 22,
    color: colors.ink,
  },
  ingredientName: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
  overview: {
    marginTop: spacing.xxl,
    gap: spacing.xs,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  overviewRowOn: {
    backgroundColor: colors.lime,
  },
  overviewNumber: {
    width: 24,
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  overviewText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  overviewDone: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
});
