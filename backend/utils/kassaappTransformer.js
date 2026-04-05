/**
 * Transform Kassalapp product format to Middag ingredient format
 */

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
    'pack': 'pakke',
    'pakke': 'pakke',
    'bunt': 'bunt',
    'box': 'boks',
    'boks': 'boks',
  };

  const normalized = (weightUnit || '').toLowerCase().trim();
  return unitMap[normalized] || 'g';
}

/**
 * Infer the best unit and quantity for an ingredient
 */
export function inferQuantity(kassalappProduct) {
  const weight = kassalappProduct.weight || 0;
  const unit = kassalappProduct.weight_unit || '';

  // For packaged items, use "stk" (piece)
  if (unit.toLowerCase() === 'piece') {
    return { quantity: 1, unit: 'stk' };
  }

  // For grams/ml, return the weight/unit
  if (unit.toLowerCase() === 'g' || unit.toLowerCase() === 'gram') {
    // If it's a standard package (200-500g), return 1 package
    if (weight >= 200 && weight <= 500) {
      return { quantity: 1, unit: 'pakke' };
    }
    return { quantity: weight, unit: 'g' };
  }

  return { quantity: weight || 1, unit: mapUnit(unit) };
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

  return {
    name: kassalappProduct.name,
    category,
    price: kassalappProduct.current_price || 0,
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
