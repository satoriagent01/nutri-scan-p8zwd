/**
 * OCR Module - Extracts nutrition information from text
 * Uses AI-powered OCR (Tesseract.js) for image text extraction
 */

/**
 * Extracts text from an image buffer using Tesseract.js OCR
 * @param {Buffer} imageBuffer - The image buffer to process
 * @returns {Promise<string>} The extracted text
 */
export async function extractText(imageBuffer) {
  // In production, this would use Tesseract.js:
  // const { createWorker } = require('tesseract.js');
  // const worker = await createWorker();
  // await worker.loadLanguage('eng');
  // await worker.initialize('eng');
  // const { data: { text } } = await worker.recognize(imageBuffer);
  // await worker.terminate();
  // return text;
  
  // For now, return empty string as placeholder
  return '';
}

/**
 * Extracts nutrition data from OCR text
 * @param {string} text - The OCR-extracted text
 * @returns {Object} Nutrition data with energy, fats, carbs, proteins, etc.
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
  // Pattern: "Energy / Energie / Energie / energia: 2292 kJ / 549 kcal"
  const energyPatterns = [
    /(?:energy|energie|energi|energia)\s*[:\-]?\s*(\d+)\s*(?:kJ|kcal)/gi,
    /(?:energy|energie|energi|energia)\s*[:\-]?\s*(\d+)\s*(?:kJ|kcal)\s*\/\s*(\d+)\s*(?:kcal|kJ)/gi
  ];

  for (const pattern of energyPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Extract numeric values
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.energy = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "Fett / matières grasses / vetten / grassi: 33 g"
  const fatPatterns = [
    /(?:fett|matieres grasses|matières grasses|vetten|grassi)\s*[:\-]?\s*(\d+)\s*g/gi,
    /(?:fett|matieres grasses|matières grasses|vetten|grassi)\s*[:\-]?\s*(\d+)\s*(?:g|gram)/gi
  ];

  for (const pattern of fatPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.fat = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi: 13 g"
  const saturatedFatPatterns = [
    /(?:davon gesättigte Fettsäuren|dont acides gras saturés|waarvan verzadigde vetzuren|di cui acidi grassi saturi)\s*[:\-]?\s*(\d+)\s*g/gi,
    /(?:davon gesättigte Fettsäuren|dont acides gras saturés|waarvan verzadigde vetzuren|di cui acidi grassi saturi)\s*[:\-]?\s*(\d+)\s*(?:g|gram)/gi
  ];

  for (const pattern of saturatedFatPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.saturatedFat = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "Kohlenhydrate / glucides / koolhydraten / carboidrati: 55 g"
  const carbPatterns = [
    /(?:kohlenhydrate|glucides|koolhydraten|carboidrati)\s*[:\-]?\s*(\d+)\s*g/gi,
    /(?:kohlenhydrate|glucides|koolhydraten|carboidrati)\s*[:\-]?\s*(\d+)\s*(?:g|gram)/gi
  ];

  for (const pattern of carbPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.carbohydrates = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "Zucker / sucres / suikers / zuccheri: 45 g"
  const sugarPatterns = [
    /(?:zucker|sucres|suikers|zuccheri)\s*[:\-]?\s*(\d+)\s*g/gi,
    /(?:zucker|sucres|suikers|zuccheri)\s*[:\-]?\s*(\d+)\s*(?:g|gram)/gi
  ];

  for (const pattern of sugarPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.sugars = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "Ballaststoffe / fibres alimentaires / vezels / fibre: 2,4 g"
  const fiberPatterns = [
    /(?:ballaststoffe|fibres alimentaires|vezels|fibre)\s*[:\-]?\s*(\d+),?(\d*)\s*g/gi,
    /(?:ballaststoffe|fibres alimentaires|vezels|fibre)\s*[:\-]?\s*(\d+),?(\d*)\s*(?:g|gram)/gi
  ];

  for (const pattern of fiberPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.fiber = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "Eiweiß / protéines / eiwitten / proteine: 6,8 g"
  const proteinPatterns = [
    /(?:eiweiss|proteines|eiwitten|proteine)\s*[:\-]?\s*(\d+),?(\d*)\s*g/gi,
    /(?:eiweiss|proteines|eiwitten|proteine)\s*[:\-]?\s*(\d+),?(\d*)\s*(?:g|gram)/gi
  ];

  for (const pattern of proteinPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.protein = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "Salz / sel / zout / sale: 0,18 g"
  const saltPatterns = [
    /(?:salz|sel|zout|sale)\s*[:\-]?\s*(\d+),?(\d*)\s*g/gi,
    /(?:salz|sel|zout|sale)\s*[:\-]?\s*(\d+),?(\d*)\s*(?:g|gram)/gi
  ];

  for (const pattern of saltPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.salt = parseInt(numbers[0], 10);
        break;
      }
    }
  }

  // Pattern: "100 g" or "per 100 ml" or "per 100g"
  const servingPatterns = [
    /(?:per|\/)\s*(\d+)\s*(?:g|ml)/gi,
    /(\d+)\s*(?:g|ml)\s*(?:per|\/)/gi
  ];

  for (const pattern of servingPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numbers = match[0].match(/(\d+)/g);
      if (numbers && numbers.length >= 1) {
        result.servingSize = parseInt(numbers[0], 10);
        result.servingUnit = match[0].includes('ml') ? 'ml' : 'g';
        break;
      }
    }
  }

  return result;
}