// Clean iOS-native design system
// Light surfaces, appetizing coral accent, system typography
export const colors = {
  // Backgrounds
  bg: '#f6f6f8',          // Main background (iOS grouped background)
  bgAlt: '#ffffff',       // Cards / elevated surfaces
  bgLight: '#ededf0',     // Subtle fills (icon buttons, inactive pills)
  bgAccent: '#fff1ec',    // Tinted background for selected states

  // Text
  text: '#17171c',        // Main text (near-black)
  textSecond: '#5f5f68',  // Secondary text
  textTertiary: '#9c9ca6', // Tertiary text / placeholders

  // Accents
  accent: '#ff5a36',      // Primary accent (appetizing tomato-coral)
  accentDark: '#e64726',  // Darker accent on hover/press
  accentAlt: '#23a559',   // Alt accent (fresh green – success, prices)
  accentAltLight: '#e9f7ee', // Tinted background for green accent

  // UI
  border: '#e6e6ea',      // Borders
  borderLight: '#f0f0f3', // Light border
  hairline: '#f2f2f5',    // Dividers
  white: '#fff',          // White

  // States
  error: '#e0282e',       // Error
  success: '#23a559',     // Success (same as accentAlt)
};

export const shadows = {
  sm: '0 1px 2px rgba(20,20,30,0.04), 0 2px 8px rgba(20,20,30,0.04)',
  md: '0 2px 4px rgba(20,20,30,0.04), 0 8px 24px rgba(20,20,30,0.07)',
  lg: '0 4px 8px rgba(20,20,30,0.05), 0 16px 40px rgba(20,20,30,0.1)',
  accent: '0 8px 24px rgba(255,90,54,0.32)',
};

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  round: '999px',
};
