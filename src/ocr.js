/**
 * OCR Module - Extracts nutrition information from text
 * Simulates OCR by parsing structured nutrition text
 */

/**
 * Extracts plain text from an image (simulated)
 * @param {string} imageData - Base64 encoded image or file path
 * @returns {Promise<string>} Extracted text
 */
export async function extractText(imageData) {
  // In a real implementation, this would use Tesseract.js or similar
  // For now, return a placeholder that would come from OCR
  return '';
}

/**
 * Extracts nutrition data from OCR text
 * @param {string} text - Text extracted from image
 * @returns {object} Nutrition data with energy, fat, carbs, protein, etc.
 */
export function extractNutritionFromText(text) {
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
    servingUnit: null
  };

  // Look for nutrition table patterns
  // Pattern: "Energie / énergie / energie / energia: 2292 kJ / 549 kcal"
  const energyMatch = text.match(/(?:energie|energy|energia|energi)[^:]*:\s*(\d+)\s*(?:kJ|kcal)/i);
  if (energyMatch) {
    result.energy = parseInt(energyMatch[1], 10);
  }

  // Pattern: "Fett / matières grasses / vetten / grassi: 33 g"
  const fatMatch = text.match(/(?:fett|matières grasses|vetten|grassi|fat|fats)[^:]*:\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (fatMatch) {
    result.fat = parseFloat(fatMatch[1]);
  }

  // Pattern: "davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi: 13 g"
  const satFatMatch = text.match(/(?:davon gesättigte|dont acides gras saturés|waarvan verzadigde vetzuren|di cui acidi grassi saturi|saturated fat|saturated fats)[^:]*:\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (satFatMatch) {
    result.saturatedFat = parseFloat(satFatMatch[1]);
  }

  // Pattern: "Kohlenhydrate / glucides / koolhydraten / carboidrati: 55 g"
  const carbsMatch = text.match(/(?:kohlenhydrate|glucides|koolhydraten|carboidrati|carbohydrate|carbohydrates)[^:]*:\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (carbsMatch) {
    result.carbohydrates = parseFloat(carbsMatch[1]);
  }

  // Pattern: "Zucker / sucre / suiker / zuccheri / sugars: 45 g"
  const sugarsMatch = text.match(/(?:zucker|sucre|suiker|zuccheri|sugars|sugar)[^:]*:\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (sugarsMatch) {
    result.sugars = parseFloat(sugarsMatch[1]);
  }

  // Pattern: "Ballaststoffe / fibres alimentaires / vezels / fibre / fiber: 2,4 g"
  const fiberMatch = text.match(/(?:ballaststoffe|fibres alimentaires|vezels|fibre|fiber)[^:]*:\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (fiberMatch) {
    result.fiber = parseFloat(fiberMatch[1]);
  }

  // Pattern: "Eiweiß / protéines / eiwitten / proteine / protein: 6,8 g"
  const proteinMatch = text.match(/(?:eiweiß|protéines|eiwitten|proteine|protein)[^:]*:\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (proteinMatch) {
    result.protein = parseFloat(proteinMatch[1]);
  }

  // Pattern: "Salz / sel / zout / sale / salt: 0,18 g"
  const saltMatch = text.match(/(?:salz|sel|zout|sale|salt)[^:]*:\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (saltMatch) {
    result.salt = parseFloat(saltMatch[1]);
  }

  // Extract serving size
  const servingMatch = text.match(/(?:portion|serving|portie|porzione|porción)[^:]*:\s*(\d+)\s*(ml|g|ml|gram|grams)/i);
  if (servingMatch) {
    result.servingSize = parseInt(servingMatch[1], 10);
    result.servingUnit = servingMatch[2];
  }

  // Check if any nutrition data was found
  const hasNutritionData = Object.values(result).some(value => value !== null);
  
  if (!hasNutritionData) {
    return {};
  }

  return result;
}