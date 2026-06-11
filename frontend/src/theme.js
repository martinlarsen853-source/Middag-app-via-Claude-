// Fresh & appetizing design system — deep green brand, clean white surfaces,
// dark pill buttons, bold typography. Inspired by modern meal-kit apps.
export const colors = {
  // Backgrounds
  bg: '#ffffff',          // Main background (clean white)
  bgAlt: '#ffffff',       // Cards / elevated surfaces
  bgLight: '#f1f1ec',     // Subtle warm-gray fills (chips, inactive pills)
  bgAccent: '#e6f1ef',    // Tinted teal background for selected states

  // Text
  text: '#1c1c1a',        // Main text (near-black)
  textSecond: '#56564f',  // Secondary text
  textTertiary: '#94948c', // Tertiary text / placeholders

  // Accents
  accent: '#0e6b60',      // Primary brand (deep teal – fresh, distinctly Tallerken)
  accentDark: '#0a5048',  // Darker teal on hover/press
  accentAlt: '#e2772e',   // Alt accent (warm apricot – highlights, favorites)
  accentAltLight: '#fdeede', // Tinted background for apricot accent

  // Buttons
  dark: '#1c1c1a',        // Dark pill buttons (primary CTAs)
  darkHover: '#333330',

  // UI
  border: '#e4e4df',      // Borders
  borderLight: '#efefea', // Light border
  hairline: '#f4f4f0',    // Dividers
  white: '#fff',          // White

  // States
  error: '#cc2f26',       // Error
  success: '#0e6b60',     // Success (same as accent)
};

export const shadows = {
  sm: '0 1px 2px rgba(28,28,26,0.05), 0 2px 6px rgba(28,28,26,0.04)',
  md: '0 2px 4px rgba(28,28,26,0.05), 0 8px 20px rgba(28,28,26,0.08)',
  lg: '0 4px 8px rgba(28,28,26,0.06), 0 16px 40px rgba(28,28,26,0.12)',
  accent: '0 6px 20px rgba(14,107,96,0.3)',
};

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  round: '999px',
};

// Soft, appetizing gradients for meal-card heroes (keyed by meal category)
export const mealGradients = {
  'Pasta':  'linear-gradient(135deg, #fdf0d5 0%, #f7d9a8 100%)',
  'Fisk':   'linear-gradient(135deg, #d9eef7 0%, #aed4e8 100%)',
  'Kjøtt':  'linear-gradient(135deg, #fbe3d4 0%, #f0bda0 100%)',
  'Suppe':  'linear-gradient(135deg, #fdeedd 0%, #f5cfa0 100%)',
  'Salat':  'linear-gradient(135deg, #e2f2dc 0%, #bfe0b2 100%)',
  'Annet':  'linear-gradient(135deg, #ece9e1 0%, #d8d3c4 100%)',
};
export const defaultMealGradient = mealGradients['Annet'];
