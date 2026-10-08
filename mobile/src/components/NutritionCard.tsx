import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { Meal } from '@/data/meals';
import { DIABETES_TEXT, GL_TEXT, mealNutrition } from '@/lib/nutrition';

// Næring per porsjon: protein, glykemisk belastning, grønt og ultraprosessert.
// Tallene er grove anslag ut fra typiske verdier for råvarene.
export function NutritionCard({ meal }: { meal: Meal }) {
  const n = mealNutrition(meal);
  return (
    <View style={styles.card} accessibilityLabel="Næring per porsjon">
      <Title size="md">Næring per porsjon</Title>
      <Text style={styles.sub}>Anslag</Text>

      <View style={styles.stats}>
        <Stat label="Protein" value={`${n.protein} g`} />
        <Stat label="Glykemisk belastning" value={`${GL_TEXT[n.glLevel]} (${n.gl})`} />
        <Stat label="Grønt" value={`${n.veg} g`} />
      </View>

      <Row icon={n.diabetes === 'god' ? 'checkmark-circle' : n.diabetes === 'obs' ? 'alert-circle-outline' : 'ellipse-outline'} title="Blodsukker og diabetes">
        {DIABETES_TEXT[n.diabetes]}
      </Row>
      <Row icon="flask-outline" title="Ultraprosessert">
        {n.ultra.length ? `${n.ultra.join(', ')}. Lag gjerne krydder eller saus selv.` : 'Ingen typiske ultraprosesserte varer.'}
      </Row>
      {n.processedMeat.length > 0 && (
        <Row icon="restaurant-outline" title="Bearbeidet kjøtt">
          {n.processedMeat.join(', ')}. Helsedirektoratet råder til å begrense bearbeidet kjøtt.
        </Row>
      )}
      {n.fish && (
        <Row icon="fish-outline" title="Fiskemiddag">
          Teller mot rådet om fisk til middag 2–3 ganger i uka.
        </Row>
      )}

      <Text style={styles.disclaimer}>
        Grove anslag ut fra vanlige råvarer, ikke medisinske råd. Har du diabetes, følg rådene fra lege eller
        ernæringsfysiolog.
      </Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Row({ icon, title, children }: { icon: keyof typeof Ionicons.glyphMap; title: string; children: string | string[] }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.ink} style={styles.rowIcon} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
    gap: spacing.md,
  },
  sub: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: -spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    flexGrow: 1,
    flexBasis: 90,
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 26,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 15,
    color: colors.inkSoft,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  rowIcon: {
    marginTop: 2,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.ink,
  },
  rowBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
});
