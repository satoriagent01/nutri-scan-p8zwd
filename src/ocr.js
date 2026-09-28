/**
 * OCR Module - Extracts nutrition information from text
 * Simulates OCR by parsing structured nutrition text
 */

/**
 * Extracts plain text from an image (simulated)
 * @param {string} imageData - Base64 encoded image or text representation
 * @returns {string} Extracted text
 */
export function extractText(imageData) {
  // In a real implementation, this would call an OCR API
  // For now, if imageData is already text, return it
  if (typeof imageData === 'string' && !imageData.startsWith('data:')) {
    return imageData;
  }
  return '';
}

/**
 * Extracts nutrition information from text
 * @param {string} text - Text containing nutrition information
 * @returns {Object} Extracted nutrition data
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
  const energyMatch = text.match(/(?:Energie|énergie|energia|energy)\s*[:\-]?\s*(\d+)\s*(?:kJ|kcal)/i);
  if (energyMatch) {
    result.energy = parseInt(energyMatch[1], 10);
  }

  // Pattern: "Fett / matières grasses / vetten / grassi: 33 g"
  const fatMatch = text.match(/(?:Fett|matières grasses|vetten|grassi|fat)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (fatMatch) {
    result.fat = parseFloat(fatMatch[1]);
  }

  // Pattern: "davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi: 13 g"
  const satFatMatch = text.match(/(?:davon gesättigte|dont acides gras saturés|waarvan verzadigde vetzuren|di cui acidi grassi saturi|saturated fat)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (satFatMatch) {
    result.saturatedFat = parseFloat(satFatMatch[1]);
  }

  // Pattern: "Kohlenhydrate / glucides / koolhydraten / carboidrati: 55 g"
  const carbMatch = text.match(/(?:Kohlenhydrate|glucides|koolhydraten|carboidrati|carbohydrates|carbs)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (carbMatch) {
    result.carbohydrates = parseFloat(carbMatch[1]);
  }

  // Pattern: "Zucker / sucre / suiker / zuccheri / sugars: 45 g"
  const sugarMatch = text.match(/(?:Zucker|sucre|suiker|zuccheri|sugars)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (sugarMatch) {
    result.sugars = parseFloat(sugarMatch[1]);
  }

  // Pattern: "Ballaststoffe / fibres alimentaires / vezels / fibre / fiber: 2,4 g"
  const fiberMatch = text.match(/(?:Ballaststoffe|fibres alimentaires|vezels|fibre|fiber)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (fiberMatch) {
    result.fiber = parseFloat(fiberMatch[1]);
  }

  // Pattern: "Eiweiß / protéines / eiwitten / proteine / protein: 6,8 g"
  const proteinMatch = text.match(/(?:Eiweiß|protéines|eiwitten|proteine|protein)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (proteinMatch) {
    result.protein = parseFloat(proteinMatch[1]);
  }

  // Pattern: "Salz / sel / zout / sale / salt: 0,18 g"
  const saltMatch = text.match(/(?:Salz|sel|zout|sale|salt)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:g|gram)/i);
  if (saltMatch) {
    result.salt = parseFloat(saltMatch[1]);
  }

  // Extract serving size
  // Pattern: "100 g", "30 g = 1 Melto", "200 ml", "per 100 ml"
  const servingMatch = text.match(/(?:per|pro|por|pro|per)\s+(\d+(?:\.\d+)?)\s*(ml|g|gram|liter|L)/i);
  if (servingMatch) {
    result.servingSize = parseFloat(servingMatch[1]);
    result.servingUnit = servingMatch[2];
  }

  // Check if we found any nutrition data
  const hasNutritionData = Object.values(result).some(val => val !== null && val !== undefined);
  
  if (!hasNutritionData) {
    return {};
  }

  return result;
}