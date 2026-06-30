// Handleklar design system — fresh, food-forward, inspired by Norwegian recipe
// sites: off-white canvas, near-black ink, a confident green accent and soft
// green chips. Condensed bold display type, generous pill buttons.
export const colors = {
  // Backgrounds
  bg: '#FAF8F5',            // Warm off-white page
  bgAlt: '#FFFFFF',         // Cards / elevated surfaces
  bgLight: '#F2F0EC',       // Subtle fills (chips, inactive pills)
  bgAccent: '#FEF0EB',      // Tinted accent background

  // Text
  text: '#1A1A1A',          // Near-black ink
  textSecond: '#52504C',    // Secondary text
  textTertiary: '#9A9892',  // Placeholders / tertiary

  // Accents — Handleklar orange
  accent: '#E2552B',        // Primary brand orange
  accentDark: '#C4431C',    // Darker on hover/press
  accentAlt: '#FF8C5A',     // Lighter orange
  accentAltLight: '#FEF0EB',// Tinted bg for accent elements

  // Buttons
  dark: '#1A1A1A',          // Dark pill buttons
  darkHover: '#333333',

  // UI
  border: '#E5E3DE',        // Borders
  borderLight: '#EEECEA',   // Light borders
  hairline: '#F2F0EC',      // Dividers
  white: '#FFFFFF',

  // States
  error: '#D92B2B',
  success: '#1A7A4A',
};

export const shadows = {
  sm: '0 1px 3px rgba(26,26,26,0.06), 0 2px 6px rgba(26,26,26,0.04)',
  md: '0 2px 8px rgba(26,26,26,0.06), 0 8px 24px rgba(26,26,26,0.08)',
  lg: '0 4px 12px rgba(26,26,26,0.08), 0 20px 48px rgba(26,26,26,0.12)',
  accent: '0 6px 20px rgba(226,85,43,0.35)',
};

// Condensed bold display for headings (matprat-like feel), grotesque for body.
export const fonts = {
  display: "'Saira Condensed', 'Archivo', 'Arial Narrow', system-ui, sans-serif",
  body: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif",
};

export const radius = {
  sm: '8px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  round: '999px',
};

// Category gradients — subtle, warm
export const mealGradients = {
  'Pasta':     'linear-gradient(135deg, #fdf0d5 0%, #f7d9a8 100%)',
  'Fisk':      'linear-gradient(135deg, #d9eef7 0%, #aed4e8 100%)',
  'Kjøtt':     'linear-gradient(135deg, #fbe3d4 0%, #f0bda0 100%)',
  'Suppe':     'linear-gradient(135deg, #fdeedd 0%, #f5cfa0 100%)',
  'Salat':     'linear-gradient(135deg, #e2f2dc 0%, #bfe0b2 100%)',
  'Meksikansk':'linear-gradient(135deg, #fdf4d5 0%, #f5e0a0 100%)',
  'Asiatisk':  'linear-gradient(135deg, #fde8d5 0%, #f0c4a0 100%)',
  'Pizza':     'linear-gradient(135deg, #fdf2d5 0%, #f5dba0 100%)',
  'Annet':     'linear-gradient(135deg, #f0ede8 0%, #e0dbd2 100%)',
};
export const defaultMealGradient = mealGradients['Annet'];

// Curated food photos — fallback by emoji if meal has no photo_url
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;
export const mealPhotos = {
  '🍝': unsplash('photo-1621996346565-e3dbc646d9a9'),
  '🍕': unsplash('photo-1565299624946-b28f40a0ae38'),
  '🍔': unsplash('photo-1568901346375-23c9450c58cd'),
  '🥗': unsplash('photo-1546069901-ba9599a7e63c'),
  '🐟': unsplash('photo-1467003909585-2f8a72700288'),
  '🐠': unsplash('photo-1467003909585-2f8a72700288'),
  '🍗': unsplash('photo-1598103442097-8b74394b95c6'),
  '🍖': unsplash('photo-1546833999-b9f581a1996d'),
  '🥩': unsplash('photo-1546833999-b9f581a1996d'),
  '🍲': unsplash('photo-1547592166-23ac45744acd'),
  '🌮': unsplash('photo-1551504734-5ee1c4a1479b'),
  '🍳': unsplash('photo-1525351484163-7529414344d8'),
  '🍛': unsplash('photo-1512058564366-18510be2db19'),
  '🍞': unsplash('photo-1509440159596-0249088772ff'),
  '🥞': unsplash('photo-1565299507177-b0ac66763028'),
  '🥢': unsplash('photo-1512058564366-18510be2db19'),
  '🥦': unsplash('photo-1547592166-23ac45744acd'),
  '🌭': unsplash('photo-1619881590738-a111d176d906'),
  '🌶️': unsplash('photo-1547592180-85f173990554'),
  '🫙': unsplash('photo-1621996346565-e3dbc646d9a9'),
  '🦐': unsplash('photo-1565680018434-b6e2f27b2949'),
};

// Keyword → curated royalty-free food photo (own images, recipe-site style).
// Used so every meal gets a fitting photo even without an explicit photo_url.
const NAME_PHOTOS = [
  [/(pizza|pinsa|margherita)/, 'photo-1574071318508-1cdbab80d002'],
  [/(taco|burrito|fajita|enchilada|quesadilla)/, 'photo-1565299624946-b28f40a0ae38'],
  [/(lasagne|lasagna)/, 'photo-1574894709920-11b28e7367e3'],
  [/(spaghetti|bolognese|pasta|penne|carbonara|tortellini)/, 'photo-1621996346565-e3dbc646d9a9'],
  [/(laks|salmon|ørret)/, 'photo-1467003909585-2f8a72700288'],
  [/(torsk|sei|hyse|fisk|fiskekake|fiskegrateng)/, 'photo-1535140728325-a4d3707eee61'],
  [/(reke|scampi|skalldyr)/, 'photo-1565680018434-b6e2f27b2949'],
  [/(kylling|chicken|satay|wok)/, 'photo-1598103442097-8b74394b95c6'],
  [/(biff|entrecôte|entrecote|steak|indrefilet|ytrefilet)/, 'photo-1600891964092-4316c288032e'],
  [/(kjøttbolle|kjøttkake|karbonade|kjøttdeig|chili con)/, 'photo-1529042410759-befb1204b468'],
  [/(pølse|hot ?dog|grill)/, 'photo-1619881590738-a111d176d906'],
  [/(suppe|gryte|stew|shakshuka)/, 'photo-1547592166-23ac45744acd'],
  [/(salat|caesar|bowl)/, 'photo-1546069901-ba9599a7e63c'],
  [/(omelett|egg|frittata|eggerøre)/, 'photo-1525351484163-7529414344d8'],
  [/(pannekake|vaffel|waffle|crepe)/, 'photo-1528207776546-365bb710ee93'],
  [/(ris|risotto|nasi|curry|karri)/, 'photo-1512058564366-18510be2db19'],
  [/(burger|hamburger)/, 'photo-1568901346375-23c9450c58cd'],
  [/(brød|bakst|focaccia|bolle)/, 'photo-1509440159596-0249088772ff'],
];

const CATEGORY_PHOTOS = {
  'Pasta': 'photo-1621996346565-e3dbc646d9a9',
  'Fisk': 'photo-1467003909585-2f8a72700288',
  'Kjøtt': 'photo-1600891964092-4316c288032e',
  'Suppe': 'photo-1547592166-23ac45744acd',
  'Salat': 'photo-1546069901-ba9599a7e63c',
  'Meksikansk': 'photo-1565299624946-b28f40a0ae38',
  'Asiatisk': 'photo-1512058564366-18510be2db19',
  'Pizza': 'photo-1574071318508-1cdbab80d002',
};

const DEFAULT_FOOD_PHOTO = unsplash('photo-1504674900247-0877df9cc836');

// Best food photo for a meal: explicit photo_url → name keyword → category → emoji → default.
export function foodPhotoFor(meal) {
  if (!meal) return DEFAULT_FOOD_PHOTO;
  if (meal.photo_url) return meal.photo_url;
  const name = (meal.name || '').toLowerCase();
  for (const [re, id] of NAME_PHOTOS) {
    if (re.test(name)) return unsplash(id);
  }
  if (meal.category && CATEGORY_PHOTOS[meal.category]) return unsplash(CATEGORY_PHOTOS[meal.category]);
  if (meal.emoji && mealPhotos[meal.emoji]) return mealPhotos[meal.emoji];
  return DEFAULT_FOOD_PHOTO;
}
