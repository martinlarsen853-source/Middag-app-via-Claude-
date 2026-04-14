/**
 * Transform Kassalapp product format to Middag ingredient format
 */

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function round(value, decimals) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// Category mapping from Kassalapp categories to Middag categories
const CATEGORY_MAPPINGS = {
  // Kjøtt & Fisk
  'kjøtt': 'Kjøtt',
  'beef': 'Kjøtt',
  'kjøtt & fisk': 'Kjøtt',
  'kylling': 'Kjøtt',
  'storfekjøtt': 'Kjøtt',
  'gris': 'Kjøtt',
  'lam': 'Kjøtt',
  'fisk': 'Fisk',
  'laks': 'Fisk',
  'sei': 'Fisk',
  'torsk': 'Fisk',
  'reker': 'Fisk',
  'skalldyr': 'Fisk',
  'tun': 'Fisk',

  // Meieri
  'meieri': 'Meieri',
  'melk': 'Meieri',
  'ost': 'Meieri',
  'yoghurt': 'Meieri',
  'fløte': 'Meieri',
  'smør': 'Meieri',
  'egg': 'Meieri',

  // Grønnsaker
  'grønnsaker': 'Grønnsaker',
  'frukt': 'Frukt',
  'salat': 'Grønnsaker',
  'tomat': 'Grønnsaker',
  'løk': 'Grønnsaker',
  'gulrot': 'Grønnsaker',
  'potet': 'Grønnsaker',
  'brokkoli': 'Grønnsaker',
  'paprika': 'Grønnsaker',

  // Bakeri & Tørrmat
  'bakeri': 'Bakeri',
  'brød': 'Bakeri',
  'pasta': 'Tørrmat',
  'ris': 'Tørrmat',
  'mel': 'Tørrmat',
  'tørrmat': 'Tørrmat',

  // Krydder & Sauser
  'krydder': 'Krydder & sauser',
  'sauser': 'Krydder & sauser',
  'olje': 'Krydder & sauser',
  'eddik': 'Krydder & sauser',
  'salt': 'Krydder & sauser',
  'pepper': 'Krydder & sauser',

  // Diverse
  'diverse': 'Diverse',
};

/**
 * Map Kassalapp category hierarchy to Middag category
 */
export function mapCategory(kassalappCategories) {
  if (!kassalappCategories || !Array.isArray(kassalappCategories) || kassalappCategories.length === 0) {
    return 'Diverse';
  }

  // Get the leaf category (last one in the hierarchy)
  const leafCategory = kassalappCategories[kassalappCategories.length - 1].name || '';
  const leafLower = leafCategory.toLowerCase();

  // Check for direct mapping
  for (const [key, value] of Object.entries(CATEGORY_MAPPINGS)) {
    if (leafLower.includes(key)) {
      return value;
    }
  }

  // Check parent categories if available
  if (kassalappCategories.length > 1) {
    const parentCategory = kassalappCategories[0].name || '';
    const parentLower = parentCategory.toLowerCase();
    for (const [key, value] of Object.entries(CATEGORY_MAPPINGS)) {
      if (parentLower.includes(key)) {
        return value;
      }
    }
  }

  return 'Diverse';
}

/**
 * Map weight unit from Kassalapp to standard unit
 */
export function mapUnit(weightUnit) {
  const unitMap = {
    'g': 'g',
    'gram': 'g',
    'ml': 'ml',
    'liter': 'l',
    'l': 'l',
    'piece': 'stk',
    'stk': 'stk',
    'can': 'boks',
    'glass': 'glass',
    'jar': 'glass',
    'bag': 'pose',
    'pose': 'pose',
    'pack': 'pakke',
    'pakke': 'pakke',
    'package': 'pakke',
    'bunt': 'bunt',
    'bottle': 'flaske',
    'flaske': 'flaske',
    'tube': 'tube',
    'box': 'boks',
    'boks': 'boks',
  };

  const normalized = (weightUnit || '').toLowerCase().trim();
  return unitMap[normalized] || normalized || null;
}

/**
 * Infer the best unit and quantity for an ingredient
 */
export function inferQuantity(kassalappProduct) {
  const weight = toNumber(kassalappProduct.weight) || 0;
  const unit = kassalappProduct.weight_unit || '';
  const normalizedUnit = mapUnit(unit);

  // For packaged items, use "stk" (piece)
  if (normalizedUnit === 'stk') {
    return { quantity: 1, unit: 'stk' };
  }

  if (weight > 0 && normalizedUnit) {
    return { quantity: weight, unit: normalizedUnit };
  }

  return { quantity: 1, unit: normalizedUnit || 'stk' };
}

export function extractPricing(kassalappProduct) {
  const packagePrice = toNumber(kassalappProduct.current_price);
  const packageUnit = mapUnit(kassalappProduct.weight_unit);
  const packageQuantity = toNumber(kassalappProduct.weight)
    ?? (['stk', 'boks', 'pose', 'glass', 'pakke', 'flaske', 'tube', 'bunt'].includes(packageUnit) ? 1 : null);

  const hasPackageBasis = packagePrice !== null && packageQuantity !== null && packageQuantity > 0;
  const hasPieceBasis = packagePrice !== null && packageUnit === 'stk';

  let unitPrice = null;
  let unitPriceUnit = null;

  if (hasPackageBasis && !['stk', 'pakke', 'boks', 'pose', 'glass', 'flaske', 'tube', 'bunt'].includes(packageUnit)) {
    unitPrice = round(packagePrice / packageQuantity, 6);
    unitPriceUnit = packageUnit;
  } else if (hasPieceBasis) {
    unitPrice = packagePrice;
    unitPriceUnit = 'stk';
  }

  return {
    package_price: packagePrice,
    package_quantity: packageQuantity,
    package_unit: packageUnit || null,
    unit_price: unitPrice,
    unit_price_unit: unitPriceUnit,
    price_source: 'kassalapp',
    price_last_synced_at: new Date(),
    has_price_basis: Boolean(
      packagePrice !== null &&
      (
        hasPieceBasis ||
        (packageQuantity !== null && packageQuantity > 0)
      )
    ),
  };
}

/**
 * Transform Kassalapp product to Middag ingredient format
 */
export function transformProduct(kassalappProduct) {
  if (!kassalappProduct) {
    return null;
  }

  const category = mapCategory(kassalappProduct.category);
  const { quantity, unit } = inferQuantity(kassalappProduct);
  const pricing = extractPricing(kassalappProduct);

  return {
    name: kassalappProduct.name,
    category,
    package_price: pricing.package_price,
    package_quantity: pricing.package_quantity,
    package_unit: pricing.package_unit,
    unit_price: pricing.unit_price,
    unit_price_unit: pricing.unit_price_unit,
    price_source: pricing.price_source,
    price_last_synced_at: pricing.price_last_synced_at,
    unit,
    section: 'Diverse', // Will be mapped to store sections later
    ean: kassalappProduct.ean,
    external_id: kassalappProduct.id.toString(),
    brand: kassalappProduct.brand || '',
    description: kassalappProduct.description || '',
    created_at: new Date(),
    updated_at: new Date(),
  };
}

/**
 * Transform multiple products
 */
export function transformProducts(kassalappProducts = []) {
  return kassalappProducts
    .map(transformProduct)
    .filter(product => product !== null);
}

/**
 * Batch transform products with error handling
 */
export async function transformProductsBatch(kassalappProducts = [], onProgress = null) {
  const results = [];
  const errors = [];

  for (let i = 0; i < kassalappProducts.length; i++) {
    try {
      const product = transformProduct(kassalappProducts[i]);
      if (product) {
        results.push(product);
      }
    } catch (error) {
      errors.push({
        index: i,
        product: kassalappProducts[i],
        error: error.message,
      });
    }

    if (onProgress) {
      onProgress({ processed: i + 1, total: kassalappProducts.length });
    }
  }

  return { results, errors };
}
