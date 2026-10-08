import type { Ingredient } from '@/data/meals';

// Et stopp er ett sted i butikken du går innom. En butikk beskrives som
// rekkefølgen av stopp fra inngangen til kassa, og handlelista sorteres etter
// den — slik går du gjennom butikken én vei uten å snu.
export type StopId =
  | 'frukt-gront'
  | 'brod'
  | 'kjott'
  | 'fisk'
  | 'palegg'
  | 'ferdigmat'
  | 'meieri'
  | 'ost'
  | 'egg'
  | 'pasta-ris'
  | 'hermetikk'
  | 'verdensmat'
  | 'sauser'
  | 'krydder'
  | 'baking'
  | 'snacks'
  | 'frys'
  | 'annet';

export const STOPS: Record<StopId, string> = {
  'frukt-gront': 'Frukt og grønt',
  brod: 'Brød og bakeri',
  kjott: 'Kjøtt og kylling',
  fisk: 'Fisk og sjømat',
  palegg: 'Pålegg og spekemat',
  ferdigmat: 'Ferdigmat og fersk pasta',
  meieri: 'Melk, fløte og smør',
  ost: 'Ost',
  egg: 'Egg',
  'pasta-ris': 'Pasta, ris og nudler',
  hermetikk: 'Hermetikk og glass',
  verdensmat: 'Taco og verdensmat',
  sauser: 'Sauser, olje og dressing',
  krydder: 'Krydder og buljong',
  baking: 'Mel, sukker og baking',
  snacks: 'Snacks og nøtter',
  frys: 'Frysevarer',
  annet: 'Annet',
};

export const ALL_STOP_IDS = Object.keys(STOPS) as StopId[];

// Rekkefølgen her betyr noe: første regel som treffer vinner. Derfor kommer
// for eksempel buljong før kjøtt (ellers havner «Kjøttbuljong» i kjøttdisken)
// og verdensmat før pasta (ellers havner «Rød karripasta» blant spaghettien).
const RULES: [StopId, RegExp][] = [
  ['frys', /frossen|frosne|fiskepinner|falafel/],
  ['egg', /^egg$/],
  ['krydder', /buljong|kraft/],
  ['verdensmat', /taco|tortilla|lefse|salsa|chili con carne-krydder|naan|karripasta|ketjap|tikka|butter chicken|kokosmelk|soyasaus|sesamolje|harissa|tahini/],
  ['ferdigmat', /tortellini|\(fersk\)|kjøttboller i tomatsaus/],
  ['palegg', /salami|spekeskinke/],
  ['fisk', /laks|torsk|klippfisk|reker|scampi|sei\b|hyse|fisk/],
  ['kjott', /kjøtt|kylling|bacon|pølse|entrecôte|biff|karbonader|lam|svin|skinke/],
  ['ost', /parmesan|mozzarella|ost\b|^ost/],
  ['meieri', /melk|fløte|rømme|smør|crème|yoghurt|kesam/],
  ['baking', /(^|\s)mel($|\s)|pizzamel|sukker($|\s)|gjær|semulegryn|strøbrød/],
  ['pasta-ris', /pasta|spaghetti|penne|makaroni|lasagne|nudl|nudel|farfalle|risotto|jasminris|basmatiris|\bris\b/],
  ['hermetikk', /hermetisk|bønner|kikerter|oliven($|\s)|sylteagurk|syltetøy|tomatpuré/],
  ['sauser', /saus|olje|majones|dressing|eddik|ketchup|sennep|pesto|sprøstekt løk/],
  ['krydder', /krydder|pulver|muskat/],
  ['brod', /brød|krutonger|rundstykk|baguette/],
  ['snacks', /peanøtter|nøtter|chips/],
];

// Når ingen regel treffer, gir den grove seksjonen fra oppskriften et rimelig svar.
const SECTION_FALLBACK: Record<string, StopId> = {
  'Frukt & grønt': 'frukt-gront',
  Bakeri: 'brod',
  'Kjøtt & fisk': 'kjott',
  Meieri: 'meieri',
  Tørrmat: 'hermetikk',
  'Krydder & sauser': 'krydder',
  Frys: 'frys',
};

// Varer du legger til selv har ingen seksjon fra en oppskrift. Da trengs flere
// mønstre for vanlige dagligvarer, ellers havner de i «Annet».
const EXTRA_RULES: [StopId, RegExp][] = [
  ['hermetikk', /finhakk|hakkede tomater|knuste tomater|passata|hermetikk|tunfisk|makrell i tomat/],
  ['egg', /\begg\b/],
  ['palegg', /pålegg|leverpostei|kaviar|servelat|kokt skinke/],
  ['frys', /\bis\b|iskrem|grandiosa|frossen|frosne/],
  ['snacks', /sjokolade|godteri|godis|chips|snacks|nøtter|kjeks/],
  ['brod', /brød|lompe|knekkebrød|rundstykk|boller|polarbrød/],
  ['meieri', /yoghurt|kesam|cottage|skyr|kefir|fløte|melk|smør/],
  [
    'frukt-gront',
    /tomat|agurk|løk|eple|banan|salat|potet|gulrot|paprika|brokkoli|blomkål|sitron|lime|avokado|appelsin|klementin|drue|bær|ruccola|spinat|squash|sopp|ingefær|chili|hvitløk|purre|selleri|kål|dill|persille|basilikum|koriander|pære|melon|ananas|mango/,
  ],
];

export function stopFor(ingredient: Pick<Ingredient, 'name' | 'section'>): StopId {
  const name = ingredient.name.toLowerCase();
  if (ingredient.section === 'Frys') return 'frys';
  for (const [stop, pattern] of RULES) {
    if (pattern.test(name)) return stop;
  }
  if (!ingredient.section) {
    for (const [stop, pattern] of EXTRA_RULES) {
      if (pattern.test(name)) return stop;
    }
  }
  return SECTION_FALLBACK[ingredient.section] ?? 'annet';
}
