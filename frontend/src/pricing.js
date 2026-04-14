const UNIT_ALIASES = {
  gram: 'g',
  grams: 'g',
  kg: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  ml: 'ml',
  milliliter: 'ml',
  milliliters: 'ml',
  l: 'l',
  liter: 'l',
  liters: 'l',
  piece: 'stk',
  pieces: 'stk',
  jar: 'glass',
  jars: 'glass',
  glass: 'glass',
  can: 'boks',
  cans: 'boks',
  box: 'boks',
  boxes: 'boks',
  bag: 'pose',
  bags: 'pose',
  pouch: 'pose',
  pouches: 'pose',
  packet: 'pakke',
  packets: 'pakke',
  package: 'pakke',
  packages: 'pakke',
  bottle: 'flaske',
  bottles: 'flaske',
  tube: 'tube',
  tubes: 'tube',
};

const CONVERSIONS = {
  g: { g: 1, kg: 1 / 1000 },
  kg: { kg: 1, g: 1000 },
  ml: { ml: 1, l: 1 / 1000 },
  l: { l: 1, ml: 1000 },
  stk: { stk: 1 },
  pakke: { pakke: 1 },
  boks: { boks: 1 },
  pose: { pose: 1 },
  glass: { glass: 1 },
  flaske: { flaske: 1 },
  tube: { tube: 1 },
  bunt: { bunt: 1 },
};

function round(value, decimals = 2) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function normalizeUnit(unit) {
  const normalized = String(unit || '').trim().toLowerCase();
  return UNIT_ALIASES[normalized] || normalized || null;
}

export function convertQuantity(quantity, fromUnit, toUnit) {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericQuantity)) return null;
  if (!from || !to) return null;
  if (from === to) return numericQuantity;

  const factor = CONVERSIONS[from]?.[to];
  return Number.isFinite(factor) ? numericQuantity * factor : null;
}

export function calculateIngredientCost(ingredient, quantity = 1, quantityUnit = ingredient?.unit) {
  const qty = Number(quantity);
  if (!ingredient || !Number.isFinite(qty)) {
    return { status: 'unknown', total: null, reason: 'missing-ingredient' };
  }

  if (ingredient.price_source && ingredient.price_source !== 'kassalapp') {
    return { status: 'unknown', total: null, reason: 'non-kassalapp-price-source' };
  }

  const requestedUnit = normalizeUnit(quantityUnit || ingredient.unit);
  const unitPrice = Number(ingredient.unit_price);
  const unitPriceUnit = normalizeUnit(ingredient.unit_price_unit);
  const packagePrice = Number(ingredient.package_price);
  const packageQuantity = Number(ingredient.package_quantity);
  const packageUnit = normalizeUnit(ingredient.package_unit);
  const needsExplicitPackageSize = ['boks', 'pose', 'glass', 'pakke', 'flaske', 'tube', 'stk'].includes(packageUnit);

  if (Number.isFinite(unitPrice) && unitPrice > 0 && unitPriceUnit) {
    const converted = convertQuantity(qty, requestedUnit, unitPriceUnit);
    if (converted !== null) {
      return {
        status: 'ok',
        total: round(converted * unitPrice),
        basis: 'unit_price',
      };
    }
  }

  if (Number.isFinite(packagePrice) && packagePrice > 0 && packageUnit) {
    const converted = convertQuantity(qty, requestedUnit, packageUnit);
    const hasPackageQuantity = Number.isFinite(packageQuantity) && packageQuantity > 0;
    if (converted !== null && (hasPackageQuantity || needsExplicitPackageSize)) {
      const divisor = hasPackageQuantity ? packageQuantity : 1;
      return {
        status: 'ok',
        total: round((converted / divisor) * packagePrice),
        basis: 'package_price',
      };
    }
  }

  return { status: 'unknown', total: null, reason: 'missing-price-basis' };
}

export function formatCurrency(value) {
  return Number.isFinite(value) ? `${value.toFixed(2)} kr` : 'Ukjent pris';
}

export function describeIngredientPricing(ingredient) {
  if (ingredient?.price_source && ingredient.price_source !== 'kassalapp') {
    return 'Legacy pris skjult til Kassalapp-sync har oppdatert varen';
  }

  const packagePrice = Number(ingredient?.package_price);
  const packageQuantity = Number(ingredient?.package_quantity);
  const packageUnit = normalizeUnit(ingredient?.package_unit);
  const unitPrice = Number(ingredient?.unit_price);
  const unitPriceUnit = normalizeUnit(ingredient?.unit_price_unit);

  if (Number.isFinite(unitPrice) && unitPrice > 0 && unitPriceUnit) {
    return `${unitPrice.toFixed(2)} kr / ${unitPriceUnit}`;
  }

  if (Number.isFinite(packagePrice) && packagePrice > 0 && packageUnit) {
    if (Number.isFinite(packageQuantity) && packageQuantity > 0) {
      return `${packagePrice.toFixed(2)} kr per ${packageQuantity} ${packageUnit}`;
    }
    return `${packagePrice.toFixed(2)} kr / ${packageUnit}`;
  }

  return 'Pris mangler fra Kassalapp';
}
