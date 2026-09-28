/**
 * OCR Module - Extracts nutrition information from text
 */

/**
 * Extracts text from an image (simulated - in production would use Tesseract.js or similar)
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} Extracted text
 */
export async function extractText(imagePath) {
  // In production, this would use Tesseract.js or an AI OCR service
  // For now, return a placeholder that would be replaced with actual OCR
  return `Nährwertdeklaration
Pro 100g
Energie 2292kJ 549kcal
Fett 33g
davon gesättigte Fettsäuren 13g
Kohlenhydrate 55g
davon Zucker 45g
Ballaststoffe 2,4g
Eiweiß 6,8g
Salz 0,18g`;
}

/**
 * Extracts nutrition data from OCR text
 * @param {string} text - OCR extracted text
 * @returns {object} Nutrition data object
 */
export function extractNutritionFromText(text) {
  const result = {
    energie: null,
    fett: null,
    gesaettigte_fettsaeuren: null,
    kohlenhydrate: null,
    zucker: null,
    ballaststoffe: null,
    eiweiss: null,
    salz: null
  };

  // Parse German labels
  const germanPatterns = {
    energie: /(?:energie|calories?)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*(?:kJ|kcal)/i,
    fett: /(?:fett|fat|matieres grasses|vetten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    gesaettigte_fettsaeuren: /(?:gesaettigte fettsauren|vetzuren|acides gras satures|verzadigde vetzuren)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    kohlenhydrate: /(?:kohlenhydrate|carbohydrates|glucides|koolhydraten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    zucker: /(?:zucker|sugar|sucre|suikers)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    ballaststoffe: /(?:ballaststoffe|fiber|fibres|vezels)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    eiweiss: /(?:eiweiss|protein|proteines|eiwitten|proteine)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    salz: /(?:salz|salt|sel|sale)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i
  };

  // Parse Italian labels
  const italianPatterns = {
    energia: /(?:energia|energy|energie|energie)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*(?:kJ|kcal)/i,
    grassi: /(?:grassi|fat|matiere grasse|vetten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    saturi: /(?:saturi|saturated|satures|verzadigde)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    carboidrati: /(?:carboidrati|carbohydrates|glucides|koolhydraten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    zuccheri: /(?:zuccheri|sugars|sucres|suikers)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    fibre: /(?:fibre|fiber|fibres|vezels)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    proteine: /(?:proteine|protein|proteines|eiwitten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    sale: /(?:sale|salt|sel|sale)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i
  };

  // Parse Dutch labels
  const dutchPatterns = {
    energie: /(?:energie|energy|energie|energie)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*(?:kJ|kcal)/i,
    vetten: /(?:vetten|fat|matieres grasses|vetten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    verzadigde: /(?:verzadigde|saturated|satures|saturi)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    koolhydraten: /(?:koolhydraten|carbohydrates|glucides|carboidrati)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    suikers: /(?:suikers|sugar|sucres|zucker)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    vezels: /(?:vezels|fiber|fibre|ballaststoffe)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    eiwitten: /(?:eiwitten|protein|proteines|eiweiss)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    zout: /(?:zout|salt|sel|sale)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i
  };

  // Parse French labels
  const frenchPatterns = {
    energie: /(?:energie|energy|energia|energia)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*(?:kJ|kcal)/i,
    matieres_grasses: /(?:matieres grasses|fat|grassi|vetten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    acides_gras_satures: /(?:acides gras satures|saturated|saturi|verzadigde)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    glucides: /(?:glucides|carbohydrates|carboidrati|koolhydraten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    sucres: /(?:sucres|sugar|zucker|suikers)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    fibres: /(?:fibres|fiber|fibre|vezels)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    proteines: /(?:proteines|protein|proteine|eiwitten)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i,
    sel: /(?:sel|salt|sale|zout)\s*[:\s]*\s*(\d+(?:\.\d+)?)\s*g/i
  };

  // Try German patterns first
  for (const [key, pattern] of Object.entries(germanPatterns)) {
    const match = text.match(pattern);
    if (match) {
      result[key] = parseFloat(match[1]);
    }
  }

  // Try Italian patterns
  for (const [key, pattern] of Object.entries(italianPatterns)) {
    const match = text.match(pattern);
    if (match) {
      // Map Italian keys to German keys
      const keyMap = {
        energia: 'energie',
        grassi: 'fett',
        saturi: 'gesaettigte_fettsaeuren',
        carboidrati: 'kohlenhydrate',
        zuccheri: 'zucker',
        fibre: 'ballaststoffe',
        proteine: 'eiweiss',
        sale: 'salz'
      };
      if (keyMap[key]) {
        result[keyMap[key]] = parseFloat(match[1]);
      }
    }
  }

  // Try Dutch patterns
  for (const [key, pattern] of Object.entries(dutchPatterns)) {
    const match = text.match(pattern);
    if (match) {
      // Map Dutch keys to German keys
      const keyMap = {
        energie: 'energie',
        vetten: 'fett',
        verzadigde: 'gesaettigte_fettsaeuren',
        koolhydraten: 'kohlenhydrate',
        suikers: 'zucker',
        vezels: 'ballaststoffe',
        eiwitten: 'eiweiss',
        zout: 'salz'
      };
      if (keyMap[key]) {
        result[keyMap[key]] = parseFloat(match[1]);
      }
    }
  }

  // Try French patterns
  for (const [key, pattern] of Object.entries(frenchPatterns)) {
    const match = text.match(pattern);
    if (match) {
      // Map French keys to German keys
      const keyMap = {
        energie: 'energie',
        matieres_grasses: 'fett',
        acides_gras_satures: 'gesaettigte_fettsaeuren',
        glucides: 'kohlenhydrate',
        sucres: 'zucker',
        fibres: 'ballaststoffe',
        proteines: 'eiweiss',
        sel: 'salz'
      };
      if (keyMap[key]) {
        result[keyMap[key]] = parseFloat(match[1]);
      }
    }
  }

  return result;
}