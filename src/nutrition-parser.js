/**
 * Nutrition Parser Module
 * Parses nutrition table data from OCR text into structured format
 */

/**
 * Parse nutrition table from OCR text
 * @param {string} text - OCR extracted text containing nutrition info
 * @returns {Object} Parsed nutrition data with values per 100g/ml
 */
export function parseNutritionTable(text) {
  const result = {
    energy: null,
    fat: null,
    saturatedFat: null,
    carbohydrates: null,
    sugars: null,
    fiber: null,
    protein: null,
    salt: null,
    servingSize: null,
    servingWeight: null
  };

  // Extract serving information
  const servingMatch = text.match(/(?:serving|portie|porzione|portion|serving size)[:\s]*(\d+(?:\.\d+)?)\s*(g|ml)/i);
  if (servingMatch) {
    result.servingWeight = parseFloat(servingMatch[1]);
    result.servingSize = servingMatch[2];
  }

  // Parse nutrition values - look for patterns like "Energy 2292 kJ / 549 kcal"
  const energyMatch = text.match(/(?:energy|energie|energi|energia|calories|calorías)[:\s]*(\d+(?:\.\d+)?)\s*(?:kJ|kj|kcal|kilocalories)/i);
  if (energyMatch) {
    result.energy = parseFloat(energyMatch[1]);
  }

  // Parse fat
  const fatMatch = text.match(/(?:fat|fett|vet|gras|grasa|grassi|lipidi|fats)[:\s]*(\d+(?:\.\d+)?)\s*g/i);
  if (fatMatch) {
    result.fat = parseFloat(fatMatch[1]);
  }

  // Parse saturated fat
  const satFatMatch = text.match(/(?:saturated fat|gesättigte fettsäuren|verzadigde vetzuren|acidi grassi saturi|matières grasses saturées|grasos saturats)[:\s]*(\d+(?:\.\d+)?)\s*g/i);
  if (satFatMatch) {
    result.saturatedFat = parseFloat(satFatMatch[1]);
  }

  // Parse carbohydrates
  const carbMatch = text.match(/(?:carbohydrate|koolhydraten|kohlenhydrate|carbohydrati|glucides|hidratos de carbono|carboidratos)[:\s]*(\d+(?:\.\d+)?)\s*g/i);
  if (carbMatch) {
    result.carbohydrates = parseFloat(carbMatch[1]);
  }

  // Parse sugars
  const sugarMatch = text.match(/(?:sugars|zucker|suiker|zucchero|sucre|azúcar|zuccheri|sucre)[:\s]*(\d+(?:\.\d+)?)\s*g/i);
  if (sugarMatch) {
    result.sugars = parseFloat(sugarMatch[1]);
  }

  // Parse fiber
  const fiberMatch = text.match(/(?:fiber|ballaststoffe|vezels|fibre|fibra|fibre|fibre)[:\s]*(\d+(?:\.\d+)?)\s*g/i);
  if (fiberMatch) {
    result.fiber = parseFloat(fiberMatch[1]);
  }

  // Parse protein
  const proteinMatch = text.match(/(?:protein|eiweiß|eiwit|proteine|protéines|proteína|proteine|proteine)[:\s]*(\d+(?:\.\d+)?)\s*g/i);
  if (proteinMatch) {
    result.protein = parseFloat(proteinMatch[1]);
  }

  // Parse salt
  const saltMatch = text.match(/(?:salt|salz|zout|sale|sel|sal|sodium|sodio)[:\s]*(\d+(?:\.\d+)?)\s*g/i);
  if (saltMatch) {
    result.salt = parseFloat(saltMatch[1]);
  }

  return result;
}

/**
 * Calculate nutrition values for a specific weight based on per 100g/ml values
 * @param {Object} nutritionData - Nutrition data per 100g/ml
 * @param {number} weight - Weight in grams to calculate for
 * @returns {Object} Nutrition values for the specified weight
 */
export function calculateNutritionForWeight(nutritionData, weight) {
  const factor = weight / 100;
  return {
    energy: nutritionData.energy ? nutritionData.energy * factor : null,
    fat: nutritionData.fat ? nutritionData.fat * factor : null,
    saturatedFat: nutritionData.saturatedFat ? nutritionData.saturatedFat * factor : null,
    carbohydrates: nutritionData.carbohydrates ? nutritionData.carbohydrates * factor : null,
    sugars: nutritionData.sugars ? nutritionData.sugars * factor : null,
    fiber: nutritionData.fiber ? nutritionData.fiber * factor : null,
    protein: nutritionData.protein ? nutritionData.protein * factor : null,
    salt: nutritionData.salt ? nutritionData.salt * factor : null
  };
}