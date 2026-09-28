/**
 * OCR Module - Extracts nutrition information from text
 * Simulates OCR by parsing structured nutrition data from text
 */

/**
 * Extracts nutrition data from OCR text
 * @param {string} text - The OCR-extracted text from an image
 * @returns {object} - Object with nutrition data and serving info
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
    servingUnit: null,
    per: null
  };

  // Detect language and parse accordingly
  const lowerText = text.toLowerCase();
  
  // Check for nutrition table patterns
  const hasNutritionKeywords = /nährwert|nutrition|nutritional|voedingswaarde|dichiarazione|nutrizione/i.test(lowerText);
  
  if (!hasNutritionKeywords) {
    return result;
  }

  // Extract serving size
  const servingPatterns = [
    /(?:per|pro|pour|per\s+100|per\s+100\s*ml|per\s+100\s*g|per\s+100\s*ml|per\s+100\s*g)\s*(?:100\s*(?:ml|g)|per\s*glass|per\s*serving|per\s*portion)/i,
    /(?:100\s*(?:ml|g)|per\s*serving|per\s*portion)/i
  ];

  // Look for serving information
  const servingMatch = text.match(/(?:per|pro|pour|per\s+100|per\s+100\s*ml|per\s+100\s*g|per\s+100\s*ml|per\s+100\s*g)\s*(\d+)\s*(ml|g|100\s*(?:ml|g))/i);
  if (servingMatch) {
    result.servingSize = parseInt(servingMatch[1]);
    result.servingUnit = servingMatch[2];
    result.per = servingMatch[0];
  }

  // Extract numeric values with units
  const valuePatterns = [
    { key: 'energy', patterns: [/energie|énergie|energy|energia/i] },
    { key: 'fat', patterns: [/fett|matières grasses|vetten|grassi|fat/i] },
    { key: 'saturatedFat', patterns: [/gesättigte|acides gras saturés|verzadigde vetzuren|grassi saturati|saturated/i] },
    { key: 'carbohydrates', patterns: [/kohlenhydrate|glucides|koolhydraten|carbohydrati|carbohydrates|carboidrati/i] },
    { key: 'sugars', patterns: [/zucker|sucres|suikers|zucchero|sugars|sucre/i] },
    { key: 'fiber', patterns: [/ballaststoffe|fibres alimentaires|vezels|fibre|fiber/i] },
    { key: 'protein', patterns: [/eiweiß|protéines|eiwitten|proteine|protein/i] },
    { key: 'salt', patterns: [/salz|sel|zout|sale|salt/i] }
  ];

  // Parse each nutrition value
  for (const { key, patterns } of valuePatterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        // Look for the value after the keyword
        const keywordIndex = match.index;
        const textAfter = text.substring(keywordIndex);
        
        // Try to find a number followed by g or kJ or kcal
        const valueMatch = textAfter.match(/(\d+(?:\.\d+)?)\s*(?:g|kJ|kcal)/);
        if (valueMatch) {
          result[key] = parseFloat(valueMatch[1]);
          break;
        }
      }
    }
  }

  return result;
}

/**
 * Extracts all text from an image (simulated)
 * @param {string} imageData - Base64 encoded image data or file path
 * @returns {string} - Extracted text
 */
export function extractText(imageData) {
  // In a real implementation, this would call an OCR API
  // For now, return a placeholder
  return '';
}