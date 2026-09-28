/**
 * Nutrition Parser Module
 * Parses nutrition table data from OCR text into structured format
 */

/**
 * Parse a nutrition table from OCR text
 * @param {string} text - OCR extracted text containing nutrition info
 * @returns {Object} Parsed nutrition data with values per 100g/ml
 */
function parseNutritionTable(text) {
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

  // Extract serving size information
  const servingMatch = text.match(/(?:serving|portie|porzione|portion|serving size)[:\s]*(\d+(?:\.\d+)?)\s*(g|ml|g\s*=\s*\d+\s*g)/i);
  if (servingMatch) {
    if (servingMatch[3]) {
      // Format like "30 g = 1 Melto"
      const servingWeightMatch = servingMatch[3].match(/(\d+)\s*g/);
      if (servingWeightMatch) {
        result.servingWeight = parseInt(servingWeightMatch[1]);
      }
    } else {
      result.servingSize = servingMatch[1];
    }
  }

  // Also check for "per X g" or "per X ml" patterns
  const perServingMatch = text.match(/per\s+(\d+(?:\.\d+)?)\s*(g|ml)/i);
  if (perServingMatch && !result.servingWeight) {
    result.servingSize = perServingMatch[1];
  }

  // Parse nutrition values - handle multi-language labels
  // Look for table rows with nutrient names and values
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Energy
    const energyMatch = line.match(/(?:energi(e|a)|calories?|kcal|kj)\s*[:\s]*([\d.]+)\s*(kj|kcal)/i);
    if (energyMatch) {
      result.energy = {
        kj: parseFloat(energyMatch[2]),
        kcal: null
      };
      // Try to find kcal on same line or next
      const kcalMatch = line.match(/([\d.]+)\s*kcal/i);
      if (kcalMatch) {
        result.energy.kcal = parseFloat(kcalMatch[1]);
      }
    }

    // Fat (Fett/matières grasses/vetten/grassi)
    const fatMatch = line.match(/(?:fett|matières grasses|vetten|grassi)\s*[:\s]*([\d.]+)\s*g/i);
    if (fatMatch) {
      result.fat = parseFloat(fatMatch[1]);
    }

    // Saturated Fat (davon gesättigte Fettsäuren/dont acides gras saturés/waarvan verzadigde vetzuren/di cui acidi grassi saturi)
    const satFatMatch = line.match(/(?:davon gesättigte fettsäuren|dont acides gras saturés|waarvan verzadigde vetzuren|di cui acidi grassi saturi)\s*[:\s]*([\d.]+)\s*g/i);
    if (satFatMatch) {
      result.saturatedFat = parseFloat(satFatMatch[1]);
    }

    // Carbohydrates (Kohlenhydrate/glucides/koolhydraten/carboidrati)
    const carbMatch = line.match(/(?:kohlenhydrate|glucides|koolhydraten|carboidrati)\s*[:\s]*([\d.]+)\s*g/i);
    if (carbMatch) {
      result.carbohydrates = parseFloat(carbMatch[1]);
    }

    // Sugars (Zucker/sucres/suikers/zuccheri)
    const sugarMatch = line.match(/(?:zucker|sucres|suikers|zuccheri)\s*[:\s]*([\d.]+)\s*g/i);
    if (sugarMatch) {
      result.sugars = parseFloat(sugarMatch[1]);
    }

    // Fiber (Ballaststoffe/fibres alimentaires/vezels/fibre)
    const fiberMatch = line.match(/(?:ballaststoffe|fibres alimentaires|vezels|fibre)\s*[:\s]*([\d.]+)\s*g/i);
    if (fiberMatch) {
      result.fiber = parseFloat(fiberMatch[1]);
    }

    // Protein (Eiweiß/proteínas/proteïnen/proteine)
    const proteinMatch = line.match(/(?:eiweiß|proteínas|proteïnen|proteine)\s*[:\s]*([\d.]+)\s*g/i);
    if (proteinMatch) {
      result.protein = parseFloat(proteinMatch[1]);
    }

    // Salt (Salz/sel/zout/sale)
    const saltMatch = line.match(/(?:salz|sel|zout|sale)\s*[:\s]*([\d.]+)\s*g/i);
    if (saltMatch) {
      result.salt = parseFloat(saltMatch[1]);
    }
  }

  return result;
}

/**
 * Calculate nutrition values for a specific weight
 * @param {Object} nutritionData - Nutrition data per 100g
 * @param {number} weight - Weight in grams to calculate for
 * @returns {Object} Nutrition values for the specified weight
 */
function calculateNutritionForWeight(nutritionData, weight) {
  const factor = weight / 100;
  
  const result = { ...nutritionData };
  
  if (result.energy) {
    result.energy.kj = result.energy.kj * factor;
    if (result.energy.kcal !== null) {
      result.energy.kcal = result.energy.kcal * factor;
    }
  }
  
  if (result.fat !== null) result.fat = result.fat * factor;
  if (result.saturatedFat !== null) result.saturatedFat = result.saturatedFat * factor;
  if (result.carbohydrates !== null) result.carbohydrates = result.carbohydrates * factor;
  if (result.sugars !== null) result.sugars = result.sugars * factor;
  if (result.fiber !== null) result.fiber = result.fiber * factor;
  if (result.protein !== null) result.protein = result.protein * factor;
  if (result.salt !== null) result.salt = result.salt * factor;
  
  return result;
}

module.exports = { parseNutritionTable, calculateNutritionForWeight };