// Inspirert av matprat.no: varm papirfarge, mørkegrønn tekst, lysegrønne og
// beige flater, kondenserte overskrifter og monospace på småtekst.
export const colors = {
  bg: '#FEFEF7',
  bgCool: '#F1F6F4', // litt kjøligere bakgrunn for Inspo, så du ser hvor du er
  surface: '#FFFFFF',
  beige: '#F2F1E7',
  beigeDark: '#E7E5D7',
  lime: '#E4F8CB',
  limeStrong: '#C6EE93',
  lavender: '#BCB9FB',
  ink: '#0D2B05',
  inkSoft: '#3E5435',
  muted: '#6E7B66',
  line: '#E3E2D6',
  green: '#3B7F0C',
  white: '#FFFFFF',
  danger: '#A8321F',
};

export const fonts = {
  display: 'BarlowCondensed_700Bold',
  displaySemi: 'BarlowCondensed_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

export const MAX_WIDTH = 1200;

// Bakgrunn for kortet mens bildet laster, eller hvis det ikke finnes.
export const categoryTints: Record<string, string> = {
  Pasta: '#F6E7C8',
  Fisk: '#D9ECF2',
  Kjøtt: '#F3DCCF',
  Meksikansk: '#F6EBC6',
  Pizza: '#F6E2C6',
  Enkelt: '#EDEBDD',
};

export const defaultTint = colors.beige;
