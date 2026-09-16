// Handleklar-paletten, den samme som nettsiden bruker.
export const colors = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F0EC',
  accentTint: '#FEF0EB',

  text: '#1A1A1A',
  textSecond: '#52504C',
  textTertiary: '#9A9892',

  accent: '#E2552B',
  accentDark: '#C4431C',

  border: '#E5E3DE',
  hairline: '#F2F0EC',

  success: '#1A7A4A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  round: 999,
};

// Kategorifarger for kortene når et bilde ikke lastes.
export const categoryTints: Record<string, string> = {
  Pasta: '#F7D9A8',
  Fisk: '#AED4E8',
  Kjøtt: '#F0BDA0',
  Suppe: '#F5CFA0',
  Salat: '#BFE0B2',
  Meksikansk: '#F5E0A0',
  Asiatisk: '#F0C4A0',
  Pizza: '#F5DBA0',
  Egg: '#F7E3B0',
  Enkelt: '#E0DBD2',
  Annet: '#E0DBD2',
};

export const defaultTint = categoryTints.Annet;
