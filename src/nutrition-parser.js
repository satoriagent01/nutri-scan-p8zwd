/**
 * Nutrition Parser Module
 * Parses nutrition table data from OCR text into structured format
 */

/**
 * Parse a nutrition table from OCR text
 * @param {string} text - OCR extracted text containing nutrition table
 * @returns {Object} Parsed nutrition data with energy, fat, carbs, sugars, protein, salt
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
    servingUnit: null
  };

  // Extract serving size information
  const servingPatterns = [
    /pro\s+(\d+)\s*ml/i,
    /per\s+(\d+)\s*(g|ml)/i,
    /(\d+)\s*(g|ml)\s*=\s*(\d+)\s*(g|ml)/i,
    /(\d+)\s*portions?\s*\(?\s*(\d+)\s*(g|ml)/i
  ];

  for (const pattern of servingPatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[3]) {
        // Format: "30g = 1 Melto"
        result.servingSize = parseInt(match[3]);
        result.servingUnit = match[4];
      } else {
        result.servingSize = parseInt(match[1]);
        result.servingUnit = match[2];
      }
      break;
    }
  }

  // Define nutrition terms in multiple languages
  const nutritionTerms = {
    energy: [/energi(e|a)/i, /calori(e|i)/i, /kcal/i, /kj/i],
    fat: [/fett/i, /matières grasses/i, /vetten/i, /grassi/i, /vet/i],
    saturatedFat: [/gesättigte\s+Fettsäuren/i, /acides\s+gras\s+saturés/i, /verzadigde\s+vetzuren/i, /acidi\s+grassi\s+saturi/i, /verzadigde\s+vet/i],
    carbohydrates: [/kohlenhydrate/i, /glucides/i, /koolhydraten/i, /carboidrati/i, /koolhydraten/i],
    sugars: [/zucker/i, /sucres/i, /suikers/i, /zuccheri/i, /suikers/i, /sucre/i],
    fiber: [/ballaststoffe/i, /fibres/i, /vezels/i, /fibre/i, /vezel/i],
    protein: [/eiweiß/i, /protéines/i, /eiwitten/i, /proteine/i, /eiwitten/i, /proteine/i],
    salt: [/salz/i, /sel/i, /zout/i, /sale/i, /zout/i]
  };

  // Parse each nutrition component
  for (const [key, patterns] of Object.entries(nutritionTerms)) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        // Look for the value after the term
        const index = text.toLowerCase().indexOf(match[0].toLowerCase());
        const afterTerm = text.substring(index);
        
        // Try to find value in format "term value unit" or "term value"
        const valueMatch = afterTerm.match(/(?:\d+[\.,]?\d*)\s*(g|ml|kJ|kcal|%|mg)?/);
        if (valueMatch) {
          const value = parseFloat(valueMatch[0].replace(',', '.'));
          if (!isNaN(value)) {
            result[key] = value;
            break;
          }
        }
      }
    }
  }

  // If no nutrition data found, return empty object
  if (Object.values(result).every(v => v === null)) {
    return {};
  }

  return result;
}

/**
 * Calculate nutrition values for a specific weight
 * @param {Object} nutrition - Base nutrition data (per 100g or per serving)
 * @param {number} weight - Weight in grams to calculate for
 * @param {number} baseWeight - Base weight the nutrition data is for (default 100)
 * @returns {Object} Nutrition values for the specified weight
 */
export function calculateNutritionForWeight(nutrition, weight, baseWeight = 100) {
  if (!nutrition || Object.keys(nutrition).length === 0) {
    return {};
  }

  const factor = weight / baseWeight;
  const result = {};

  for (const [key, value] of Object.entries(nutrition)) {
    if (typeof value === 'number') {
      result[key] = Math.round(value * factor * 100) / 100;
    }
  }

  return result;
}