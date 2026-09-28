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
  
  // Try to find nutrition values in various formats
  for (const line of lines) {
    // Energy
    const energyMatch = line.match(/(?:energie|energy|énergie|energia)\s*[:\s]*\s*(\d+)\s*(?:kJ|kcal)/i);
    if (energyMatch) {
      result.energy = parseInt(energyMatch[1]);
    }
    
    // Fat
    const fatMatch = line.match(/(?:fett|matières grasses|vetten|grassi|fat|matières grasses)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i);
    if (fatMatch) {
      result.fat = parseFloat(fatMatch[1]);
    }
    
    // Saturated Fat
    const satFatMatch = line.match(/(?:gesättigte Fettsäuren|acides gras saturés|verzadigde vetzuren|acidi grassi saturi|saturated fatty acids|acides gras saturés)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i);
    if (satFatMatch) {
      result.saturatedFat = parseFloat(satFatMatch[1]);
    }
    
    // Carbohydrates
    const carbMatch = line.match(/(?:kohlenhydrate|glucides|koolhydraten|carboidrati|carbohydrates|glucides)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i);
    if (carbMatch) {
      result.carbohydrates = parseFloat(carbMatch[1]);
    }
    
    // Sugars
    const sugarMatch = line.match(/(?:zucker|sucre|suikers|zucchero|sugar|sucre|suikers)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i);
    if (sugarMatch) {
      result.sugars = parseFloat(sugarMatch[1]);
    }
    
    // Fiber
    const fiberMatch = line.match(/(?:ballaststoffe|fibres alimentaires|vezels|fibre|dietary fiber|fibres alimentaires|vezels)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i);
    if (fiberMatch) {
      result.fiber = parseFloat(fiberMatch[1]);
    }
    
    // Protein
    const proteinMatch = line.match(/(?:eiweiß|protéines|eiwitten|proteine|protein|protéines|eiwitten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i);
    if (proteinMatch) {
      result.protein = parseFloat(proteinMatch[1]);
    }
    
    // Salt
    const saltMatch = line.match(/(?:salz|sel|zout|sale|salt|sel|zout)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i);
    if (saltMatch) {
      result.salt = parseFloat(saltMatch[1]);
    }
  }

  // Look for serving size information
  const servingMatch = ocrText.match(/(?:portion|serving|portie|porzione|servicio)\s*[:\s]*\s*(\d+)\s*(ml|g|stuck|stuk)/i);
  if (servingMatch) {
    result.servingSize = parseInt(servingMatch[1]);
    result.servingUnit = servingMatch[2];
  }

  return result;
}

/**
 * Extracts text from an image (simulated for now)
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractText(imagePath) {
  // In a real implementation, this would use an OCR service
  // For now, return a placeholder
  return `Nährwertdeklaration / Déclaration nutritionnelle / Voedingswaarde / Dichiarazione nutrizionale
  100g  30g = 1 Melto
  Energie / énergie / energie / energia  2292 kJ  688 kJ
  549 kcal  165 kcal
  Fett / matières grasses / vetten / grassi  33 g  10 g
  davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi  13 g  3,9 g
  Kohlenhydrate / glucides / koolhydraten / carboidrati  55 g  16 g
  davon Zucker / dont sucres / waarvan suikers / di cui zuccheri  45 g  14 g
  Ballaststoffe / fibres alimentaires / vezels / fibre  2,4 g  0,7 g
  Eiweiß / protéines / eiwitten / proteine  6,8 g  2,0 g
  Salz / sel / zout / sale  0,18 g  0,05 g`;
}