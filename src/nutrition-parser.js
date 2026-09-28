/**
 * Nutrition Parser Module
 * Parses nutrition table data into structured format
 */

/**
 * Parse nutrition table text into structured data
 * @param {string} text - OCR extracted text containing nutrition table
 * @returns {Object} Parsed nutrition data with nutrients and serving info
 */
function parseNutritionTable(text) {
  const result = {
    nutrients: {},
    servingSize: null,
    servingUnit: null,
    servingsPerContainer: null
  };

  // Extract serving information
  const servingPatterns = [
    /pro\s+(?:porzione|portion|portie|servings?|serving)\s+(\d+)\s*(g|ml|styk|stuk|bar|tablet)/i,
    /(?:per|pro|por)\s+(\d+)\s*(g|ml)\s*(?:=|per|por)/i,
    /(\d+)\s*(g|ml)\s*(?:=|per|por)\s+(\d+)\s*(g|ml)/i,
    /(?:per|pro|por)\s+(\d+)\s*(g|ml)/i
  ];

  for (const pattern of servingPatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match.length === 4) {
        // Pattern with two sizes (e.g., "100 g = 1 Melto")
        result.servingSize = parseInt(match[1]);
        result.servingUnit = match[2];
        // Second value is reference, not needed for base calculation
      } else {
        result.servingSize = parseInt(match[1]);
        result.servingUnit = match[2];
      }
      break;
    }
  }

  // Default serving size if not found
  if (!result.servingSize) {
    result.servingSize = 100;
    result.servingUnit = 'g';
  }

  // Parse nutrients - handle multi-language labels
  const nutrientPatterns = [
    // Energy (calories and kJ)
    { key: 'energy_kj', patterns: [/energie\s*[:\s]*\s*(\d+)\s*kj/i, /energy\s*[:\s]*\s*(\d+)\s*kj/i, /energi\s*[:\s]*\s*(\d+)\s*kj/i, /energi\s*[:\s]*\s*(\d+)\s*kj/i] },
    { key: 'energy_kcal', patterns: [/energie\s*[:\s]*\s*\d+\s*kj\s*(\d+)\s*kcal/i, /energy\s*[:\s]*\s*\d+\s*kj\s*(\d+)\s*kcal/i, /energi\s*[:\s]*\s*\d+\s*kj\s*(\d+)\s*kcal/i, /energi\s*[:\s]*\s*\d+\s*kj\s*(\d+)\s*kcal/i] },
    
    // Fat
    { key: 'fat', patterns: [/fett\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /matières\s*grasses\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /vetten\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /grassi\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /fat\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i] },
    
    // Saturated fat
    { key: 'saturated_fat', patterns: [/gesättigte\s*fettsäuren\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /acides\s*gras\s*saturés\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /verzadigde\s*vetzuren\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /acidi\s*grassi\s*saturi\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /saturated\s*fat\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i] },
    
    // Carbohydrates
    { key: 'carbohydrates', patterns: [/kohlenhydrate\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /glucides\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /koolhydraten\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /carbohidrati\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /carbohydrates\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i] },
    
    // Sugars
    { key: 'sugars', patterns: [/zucker\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /sucres\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /suikers\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /zuccheri\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /sugars\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i] },
    
    // Fiber
    { key: 'fiber', patterns: [/ballaststoffe\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /fibres\s*alimentaires\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /vezels\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /fibre\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /fiber\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i] },
    
    // Protein
    { key: 'protein', patterns: [/eiweiß\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /protéines\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /eiwitten\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /proteine\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /protein\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i] },
    
    // Salt/Sodium
    { key: 'salt', patterns: [/salz\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /sel\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /zout\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /sale\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i, /salt\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i] },
    { key: 'sodium', patterns: [/natrium\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*(?:mg|g)/i, /sodium\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*(?:mg|g)/i] }
  ];

  for (const nutrient of nutrientPatterns) {
    for (const pattern of nutrient.patterns) {
      const match = text.match(pattern);
      if (match) {
        // Check if this is in the per 100g column (not per serving)
        // Look for the value in the first numeric column after the nutrient name
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.match(pattern)) {
            // Extract the first numeric value (per 100g/ml)
            const values = line.match(/(\d+(?:\.\d+)?)/g);
            if (values && values.length >= 1) {
              result.nutrients[nutrient.key] = parseFloat(values[0]);
            }
            break;
          }
        }
        break;
      }
    }
  }

  return result;
}

/**
 * Calculate nutrition values for a specific weight
 * @param {Object} nutritionData - Base nutrition data (per 100g)
 * @param {number} weight - Weight in grams to calculate for
 * @returns {Object} Nutrition values for the specified weight
 */
function calculateNutritionForWeight(nutritionData, weight) {
  const factor = weight / 100;
  const result = {
    weight: weight
  };

  for (const [key, value] of Object.entries(nutritionData.nutrients)) {
    result[key] = Math.round(value * factor * 100) / 100;
  }

  return result;
}

module.exports = {
  parseNutritionTable,
  calculateNutritionForWeight
};