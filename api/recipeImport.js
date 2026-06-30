// Recipe import — fetches a recipe web page and extracts an ingredient list.
// Strategy: parse schema.org "Recipe" JSON-LD (used by virtually every recipe
// site: matprat.no, godt.no, meny.no, allrecipes, etc.). Falls back to
// microdata-ish heuristics only for the title when no JSON-LD is present.
//
// Uses the global fetch available in the Vercel Node 18+ runtime — no extra deps.

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// ── Fraction / number helpers ────────────────────────────────────────────────
const VULGAR_FRACTIONS = {
  '½': 0.5, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 0.25, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8, '⅙': 1 / 6, '⅛': 0.125,
};

function parseNumberToken(tok) {
  if (!tok) return null;
  let t = tok.trim();
  // Pure vulgar fraction, e.g. "½"
  if (VULGAR_FRACTIONS[t] != null) return VULGAR_FRACTIONS[t];
  // Mixed "1½"
  const mixed = t.match(/^(\d+)\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅛])$/);
  if (mixed) return parseInt(mixed[1], 10) + VULGAR_FRACTIONS[mixed[2]];
  // Simple fraction "1/2"
  const frac = t.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) return parseInt(frac[1], 10) / parseInt(frac[2], 10);
  // Range "2-3" → take the lower bound
  const range = t.match(/^(\d+(?:[.,]\d+)?)\s*[-–]\s*\d+(?:[.,]\d+)?$/);
  if (range) return parseFloat(range[1].replace(',', '.'));
  // Decimal with Norwegian comma or dot
  const num = t.match(/^\d+(?:[.,]\d+)?$/);
  if (num) return parseFloat(t.replace(',', '.'));
  return null;
}

// Known Norwegian measurement units (longest/most specific first when matching).
const UNITS = [
  'kg', 'hg', 'gram', 'gr', 'g',
  'liter', 'l', 'dl', 'cl', 'ml',
  'ss', 'ts', 'krm', 'knivsodd', 'kryddermål',
  'stk', 'stykk', 'porsjon', 'porsjoner',
  'boks', 'bokser', 'pakke', 'pakker', 'pk', 'pose', 'poser',
  'glass', 'flaske', 'flasker', 'dåse', 'dåser',
  'fedd', 'neve', 'never', 'klype', 'dråpe', 'dråper',
  'potte', 'bunt', 'hode', 'hoder', 'skive', 'skiver', 'terning', 'terninger',
  'ark', 'plate', 'plater', 'bit', 'biter', 'kapsel', 'kapsler', 'kopp',
];

// Normalise a few units to the app's preferred set.
function normaliseUnit(u) {
  if (!u) return null;
  const l = u.toLowerCase();
  if (l === 'gram' || l === 'gr') return 'g';
  if (l === 'liter') return 'l';
  if (l === 'stykk' || l === 'porsjon' || l === 'porsjoner') return 'stk';
  return l;
}

// ── Section guessing (so the shopping list groups by store aisle) ─────────────
// Sections match the store section_order vocabulary used across the app.
const SECTION_KEYWORDS = [
  ['Frukt & grønt', /\b(løk|rødløk|sjalottløk|vårløk|purre|hvitløk|gulr(ot|øtter)|potet|søtpotet|tomat|cherrytomat|paprika|agurk|salat|isbergsalat|ruccola|spinat|grønnkål|kål|brokkoli|blomkål|squash|aubergine|sopp|sjampinjong|champignon|mais|erter|sukkererter|bønnespirer|avokado|eple|banan|pære|sitron|lime|appelsin|klementin|druer|jordbær|bringebær|blåbær|bær|melon|ingefær|chili|sellerirot|selleri|persillerot|pastinakk|kålrot|reddik|fennikel|asparges|frisk\s|persille|basilikum|koriander|dill|timian|rosmarin|mynte|gressløk|bladpersille)\b/i],
  ['Kjøtt & fisk', /\b(kjøttdeig|karbonadedeig|kjøtt|biff|entrecôte|entrecote|indrefilet|ytrefilet|mørbrad|flatbiff|kotelett|svin|svinekjøtt|nakkekotelett|ribbe|lam|lammelår|kylling|kyllingfilet|kyllinglår|kalkun|pølse|bacon|skinke|spekemat|laks|ørret|torsk|sei|hyse|makrell|sild|reke(r)?|scampi|kamskjell|blåskjell|fisk|fiskefilet|fiskekake|fiskebolle|kjøttbolle|kjøttkake|wienerpølse)\b/i],
  ['Meieri', /\b(melk|h-melk|lettmelk|skummet|fløte|matfløte|kremfløte|rømme|seterrømme|crème fraîche|creme fraiche|yoghurt|kesam|cottage|smør|meierismør|margarin|ost|revet ost|gulost|brunost|parmesan|mozzarella|feta(ost)?|kremost|philadelphia|egg)\b/i],
  ['Bakeri', /\b(brød|loff|rundstykk(er)?|baguette|ciabatta|focaccia|pizzabunn|pita|naan|tortilla|lefse|gjær|tørrgjær|fersk gjær)\b/i],
  ['Frys', /\b(frossen|fryst|frosne|iskrem|is\b|frosne grønnsaker|fryste|frossenpizza|fiskepinner)\b/i],
  ['Drikkevarer', /\b(vann|farris|juice|appelsinjuice|brus|cola|saft|vin|rødvin|hvitvin|øl|sider|kaffe|te\b|kakaomelk)\b/i],
  ['Krydder & sauser', /\b(salt|pepper|sort pepper|krydder|olje|olivenolje|rapsolje|solsikkeolje|sesamolje|eddik|balsamico|soya(saus)?|fiskesaus|østerssaus|ketchup|sennep|majones|aioli|tomatpuré|tomatpure|hermetiske tomater|knust tomat|passata|karri|paprikapulver|spisskummen|chilipulver|cayenne|oregano|kanel|kardemomme|muskat|vanilje|vaniljesukker|nellik|laurbær|buljong|fond|kraft|honning|sirup|dressing|salsa|tabasco|worcester|pesto|sweet chili)\b/i],
  ['Tørrmat', /\b(pasta|spaghetti|penne|fusilli|makaroni|lasagne(plater)?|nudler|ris|jasminris|basmati|risotto(ris)?|couscous|bulgur|quinoa|mel|hvetemel|sammalt|maisenna|maizena|potetmel|sukker|brunt sukker|melis|farin|havregryn|müsli|musli|cornflakes|gryn|linser|kikerter|bønner|kidneybønner|sorte bønner|hermetisk|bakepulver|natron|kakao|sjokolade|kokosmelk|tacoskjell|taco|lompe|knekkebrød|rosiner|nøtter|mandler|valnøtter)\b/i],
];

function guessSection(name) {
  const n = (name || '').toLowerCase();
  for (const [section, re] of SECTION_KEYWORDS) {
    if (re.test(n)) return section;
  }
  return 'Diverse';
}

// ── Ingredient line parser ────────────────────────────────────────────────────
// "200 g spaghetti" → { name:'spaghetti', quantity:200, unit:'g', section:'Tørrmat' }
export function parseIngredientLine(raw) {
  if (!raw) return null;
  let line = String(raw).replace(/\s+/g, ' ').trim();
  if (!line) return null;

  // Strip leading list markers / bullets
  line = line.replace(/^[-•*–]\s*/, '');

  let quantity = null;
  let unit = null;
  let rest = line;

  // Leading quantity token (number, fraction, vulgar fraction, mixed, range)
  const qtyMatch = rest.match(
    /^((?:\d+\s*\/\s*\d+)|(?:\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?)|(?:\d+\s*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅛])|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅛]|(?:\d+(?:[.,]\d+)?))/
  );
  if (qtyMatch) {
    const parsed = parseNumberToken(qtyMatch[1]);
    if (parsed != null) {
      quantity = Math.round(parsed * 100) / 100;
      rest = rest.slice(qtyMatch[0].length).trim();
    }
  }

  // Unit token directly after the quantity
  if (quantity != null) {
    const unitMatch = rest.match(/^([a-zA-ZæøåÆØÅ]+)\b/);
    if (unitMatch) {
      const cand = unitMatch[1].toLowerCase();
      if (UNITS.includes(cand)) {
        unit = normaliseUnit(cand);
        rest = rest.slice(unitMatch[0].length).trim();
      }
    }
  }

  // Strip stray punctuation left after the unit (e.g. "stk. rød chili" → "rød chili")
  rest = rest.replace(/^[.\-–·,]+\s*/, '').trim();
  // Drop a leading "med ", "av ", "à ", parenthetical notes
  rest = rest.replace(/^(à|av|med)\s+/i, '').trim();
  // Remove trailing parenthetical e.g. "(ca. 400 g)" and leading "ca."
  rest = rest.replace(/\bca\.?\s*/i, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  // Cut off after comma annotations like ", finhakket"
  const namePart = rest.split(',')[0].trim() || rest;

  const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  if (!name) return null;

  // Sensible defaults when no quantity/unit was found
  if (quantity == null) quantity = 1;
  if (!unit) unit = quantity > 10 ? 'g' : 'stk';

  return { name, quantity, unit, section: guessSection(name) };
}

// ── ISO 8601 duration → minutes ("PT1H30M" → 90) ──────────────────────────────
function isoDurationToMinutes(iso) {
  if (!iso || typeof iso !== 'string') return null;
  const m = iso.match(/^P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return null;
  const hours = parseInt(m[1] || '0', 10);
  const mins = parseInt(m[2] || '0', 10);
  const total = hours * 60 + mins;
  return total > 0 ? total : null;
}

function parseYield(y) {
  if (y == null) return null;
  if (Array.isArray(y)) y = y[0];
  const m = String(y).match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

// ── JSON-LD extraction ────────────────────────────────────────────────────────
function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let raw = m[1].trim();
    // Some sites wrap JSON in CDATA or include trailing semicolons
    raw = raw.replace(/^\/\*<!\[CDATA\[\*\//, '').replace(/\/\*\]\]>\*\/$/, '').trim();
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // Ignore malformed block
    }
  }
  return blocks;
}

function isRecipeType(node) {
  if (!node || typeof node !== 'object') return false;
  const t = node['@type'];
  if (!t) return false;
  return Array.isArray(t) ? t.includes('Recipe') : t === 'Recipe';
}

function findRecipeNode(data) {
  const queue = Array.isArray(data) ? [...data] : [data];
  while (queue.length) {
    const node = queue.shift();
    if (!node || typeof node !== 'object') continue;
    if (isRecipeType(node)) return node;
    if (Array.isArray(node['@graph'])) queue.push(...node['@graph']);
    // Some feeds nest under itemListElement etc.
    for (const v of Object.values(node)) {
      if (v && typeof v === 'object') queue.push(v);
    }
  }
  return null;
}

// schema.org recipeInstructions -> flat array of step strings.
function parseInstructions(raw) {
  const out = [];
  const walk = (node) => {
    if (node == null) return;
    if (typeof node === 'string') {
      const t = decodeEntities(node).replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
      return;
    }
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (typeof node === 'object') {
      const type = node['@type'];
      if (type === 'HowToSection' || node.itemListElement) { walk(node.itemListElement); return; }
      if (node.text) { walk(node.text); return; }
      if (node.name) { walk(node.name); return; }
    }
  };
  walk(raw);
  // Some sites cram all steps into one big string with line breaks
  if (out.length === 1 && out[0].length > 200) {
    return out[0].split(/\r?\n|(?<=\.)\s+(?=[A-ZÆØÅ])/).map(s => s.trim()).filter(s => s.length > 4);
  }
  return out;
}

function pickImage(img) {
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (Array.isArray(img)) return pickImage(img[0]);
  if (typeof img === 'object') return img.url || img.contentUrl || null;
  return null;
}

function decodeEntities(s) {
  if (!s) return s;
  return String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&aring;/g, 'å').replace(/&oslash;/g, 'ø').replace(/&aelig;/g, 'æ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .trim();
}

function titleFromHtml(html) {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (og) return decodeEntities(og[1]);
  const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return t ? decodeEntities(t[1]).split('|')[0].split('-')[0].trim() : '';
}

// ── Public entry point ────────────────────────────────────────────────────────
export async function importRecipeFromUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Ugyldig nettadresse');
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error('Bare http/https-lenker støttes');
  }

  let html;
  try {
    const resp = await fetch(parsed.href, {
      headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
    });
    if (!resp.ok) throw new Error(`Nettsiden svarte ${resp.status}`);
    html = await resp.text();
  } catch (e) {
    throw new Error('Klarte ikke å hente nettsiden: ' + e.message);
  }

  const blocks = extractJsonLdBlocks(html);
  let recipe = null;
  for (const b of blocks) {
    recipe = findRecipeNode(b);
    if (recipe) break;
  }

  if (!recipe) {
    throw new Error(
      'Fant ingen oppskrift på denne siden. Prøv en direkte lenke til selve oppskriften.'
    );
  }

  const rawIngredients =
    recipe.recipeIngredient || recipe.ingredients || recipe.recipeIngredients || [];
  const ingredients = (Array.isArray(rawIngredients) ? rawIngredients : [rawIngredients])
    .map(decodeEntities)
    .map(parseIngredientLine)
    .filter(Boolean);

  if (ingredients.length === 0) {
    throw new Error('Oppskriften hadde ingen ingredienser vi kunne lese.');
  }

  const name = decodeEntities(recipe.name) || titleFromHtml(html) || 'Importert oppskrift';
  const time =
    isoDurationToMinutes(recipe.totalTime) ||
    isoDurationToMinutes(recipe.cookTime) ||
    isoDurationToMinutes(recipe.prepTime) ||
    null;
  const persons = parseYield(recipe.recipeYield);

  return {
    name,
    emoji: null, // frontend guesses from name to stay consistent with manual flow
    time_minutes: time,
    persons,
    image: pickImage(recipe.image),
    source_url: parsed.href,
    ingredients,
    instructions: parseInstructions(recipe.recipeInstructions),
  };
}
