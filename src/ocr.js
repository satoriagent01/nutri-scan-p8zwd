/**
 * OCR Module - Extracts nutrition information from text
 * Uses AI-powered OCR to extract nutrition data from product labels
 */

/**
 * Extracts nutrition data from OCR text
 * @param {string} ocrText - The text extracted from the image
 * @returns {Object} - Extracted nutrition data
 */
export function extractNutritionFromText(ocrText) {
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
  const lines = ocrText.split('\n');
  let inNutritionTable = false;
  let currentServing = null;
  let currentServingUnit = null;

  // Keywords for nutrition in different languages
  const energyKeywords = ['energie', 'énergie', 'energia', 'energy', 'calories', 'kcal', 'kj'];
  const fatKeywords = ['fett', 'matières grasses', 'vetten', 'grassi', 'fat', 'gras'];
  const saturatedFatKeywords = ['gesättigte', 'saturées', 'verzadigde', 'saturi', 'saturated', 'saturé'];
  const carbKeywords = ['kohlenhydrate', 'glucides', 'koolhydraten', 'carboidrati', 'carbohydrates', 'carbohydrate'];
  const sugarKeywords = ['zucker', 'sucre', 'suiker', 'zucchero', 'sugar', 'sucres', 'suikers'];
  const fiberKeywords = ['ballaststoffe', 'fibres', 'vezels', 'fibre', 'fiber'];
  const proteinKeywords = ['eiweiß', 'protéines', 'eiwitten', 'proteine', 'protein', 'proteína'];
  const saltKeywords = ['salz', 'sel', 'zout', 'sale', 'salt', 'sodium'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for serving size
    const servingMatch = line.match(/(?:portion|serving|portie|1\s*melto|glas|ml|g)\s*[:\s]*\s*(\d+)\s*(ml|g|piece|stuk|melto|glas)?/i);
    if (servingMatch) {
      currentServing = parseInt(servingMatch[1]);
      currentServingUnit = servingMatch[2] || 'g';
    }

    // Check for nutrition keywords
    const lowerLine = line.toLowerCase();
    
    // Energy
    if (energyKeywords.some(kw => lowerLine.includes(kw))) {
      const energyMatch = line.match(/(\d+)\s*(?:kj|kcal)/i);
      if (energyMatch) {
        result.energy = {
          kj: parseInt(energyMatch[1]),
          kcal: parseInt(energyMatch[1]) * 0.239 // rough conversion
        };
      }
    }

    // Fat
    if (fatKeywords.some(kw => lowerLine.includes(kw)) && !saturatedFatKeywords.some(kw => lowerLine.includes(kw))) {
      const fatMatch = line.match(/(\d+(?:\.\d+)?)\s*g/i);
      if (fatMatch) {
        result.fat = parseFloat(fatMatch[1]);
      }
    }

    // Saturated Fat
    if (saturatedFatKeywords.some(kw => lowerLine.includes(kw))) {
      const satFatMatch = line.match(/(\d+(?:\.\d+)?)\s*g/i);
      if (satFatMatch) {
        result.saturatedFat = parseFloat(satFatMatch[1]);
      }
    }

    // Carbohydrates
    if (carbKeywords.some(kw => lowerLine.includes(kw))) {
      const carbMatch = line.match(/(\d+(?:\.\d+)?)\s*g/i);
      if (carbMatch) {
        result.carbohydrates = parseFloat(carbMatch[1]);
      }
    }

    // Sugars
    if (sugarKeywords.some(kw => lowerLine.includes(kw))) {
      const sugarMatch = line.match(/(\d+(?:\.\d+)?)\s*g/i);
      if (sugarMatch) {
        result.sugars = parseFloat(sugarMatch[1]);
      }
    }

    // Fiber
    if (fiberKeywords.some(kw => lowerLine.includes(kw))) {
      const fiberMatch = line.match(/(\d+(?:\.\d+)?)\s*g/i);
      if (fiberMatch) {
        result.fiber = parseFloat(fiberMatch[1]);
      }
    }

    // Protein
    if (proteinKeywords.some(kw => lowerLine.includes(kw))) {
      const proteinMatch = line.match(/(\d+(?:\.\d+)?)\s*g/i);
      if (proteinMatch) {
        result.protein = parseFloat(proteinMatch[1]);
      }
    }

    // Salt/Sodium
    if (saltKeywords.some(kw => lowerLine.includes(kw))) {
      const saltMatch = line.match(/(\d+(?:\.\d+)?)\s*g/i);
      if (saltMatch) {
        result.salt = parseFloat(saltMatch[1]);
      }
    }
  }

  // Set serving size if found
  if (currentServing) {
    result.servingSize = currentServing;
    result.servingUnit = currentServingUnit;
  }

  return result;
}

/**
 * Simulates OCR text extraction from an image
 * In a real implementation, this would call an OCR API
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractText(imagePath) {
  // Simulate OCR processing
  // In a real implementation, this would call an OCR API like Tesseract or Google Vision
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return simulated OCR text based on image path
      // This would be replaced with actual OCR in production
      resolve('Simulated OCR text');
    }, 100);
  });
}