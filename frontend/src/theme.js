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

// Curated food photos keyed by the meal's auto-guessed emoji.
// Cards fall back to the category gradient + emoji if a photo fails to load.
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=60`;
export const mealPhotos = {
  '🍝': unsplash('photo-1621996346565-e3dbc646d9a9'), // spaghetti
  '🍕': unsplash('photo-1565299624946-b28f40a0ae38'), // pizza
  '🍔': unsplash('photo-1568901346375-23c9450c58cd'), // burger
  '🥗': unsplash('photo-1546069901-ba9599a7e63c'),    // salad
  '🐟': unsplash('photo-1467003909585-2f8a72700288'), // salmon
  '🐠': unsplash('photo-1467003909585-2f8a72700288'), // fish (fiskegrateng)
  '🍗': unsplash('photo-1598103442097-8b74394b95c6'), // chicken
  '🍖': unsplash('photo-1546833999-b9f581a1996d'),    // meat
  '🥩': unsplash('photo-1546833999-b9f581a1996d'),    // steak/biff
  '🍲': unsplash('photo-1547592166-23ac45744acd'),    // soup
  '🌮': unsplash('photo-1551504734-5ee1c4a1479b'),    // tacos
  '🍳': unsplash('photo-1525351484163-7529414344d8'), // eggs/omelett
  '🍛': unsplash('photo-1512058564366-18510be2db19'), // rice/curry
  '🍞': unsplash('photo-1509440159596-0249088772ff'), // bread
  '🥞': unsplash('photo-1565299507177-b0ac66763028'), // pancakes
  '🥢': unsplash('photo-1512058564366-18510be2db19'), // wok/asian
  '🥦': unsplash('photo-1547592166-23ac45744acd'),    // veg soup
  '🌭': unsplash('photo-1619881590738-a111d176d906'), // sausage
  '🌶️': unsplash('photo-1547592180-85f173990554'),   // chili
  '🫙': unsplash('photo-1621996346565-e3dbc646d9a9'), // pasta jar (tortellini/lasagne)
  '🦐': unsplash('photo-1565680018434-b6e2f27b2949'), // shrimp
};
