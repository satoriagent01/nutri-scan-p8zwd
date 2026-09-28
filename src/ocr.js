/**
 * OCR Module - Extracts nutrition information from text
 * Simulates OCR extraction from images of nutrition labels
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
  
  // Try to find serving size
  const servingMatch = ocrText.match(/(?:serving|portie|portion|servizio|porzione)\s*(?:size|size|size|dimensione)?[:\s]*\s*(\d+(?:\.\d+)?)\s*(g|ml|kg|l|oz|lb|porzioni|porciones|porzioni)/i);
  if (servingMatch) {
    result.servingSize = parseFloat(servingMatch[1]);
    result.servingUnit = servingMatch[2];
  }

  // Look for nutrition values - try multiple languages
  const nutritionPatterns = [
    { key: 'energy', patterns: [/energi[ae]/i, /calories?/i, /kcal/i, /kj/i] },
    { key: 'fat', patterns: [/fett/i, /matières grasses/i, /vetten/i, /grassi/i, /fat/i] },
    { key: 'saturatedFat', patterns: [/gesättigte fettsäuren/i, /acides gras saturés/i, /verzadigde vetzuren/i, /acidi grassi saturi/i, /saturated fat/i] },
    { key: 'carbohydrates', patterns: [/kohl(en|ä)nhydrate/i, /glucides/i, /koolhydraten/i, /carboidrati/i, /carbohydrates/i] },
    { key: 'sugars', patterns: [/zucker/i, /sucres/i, /suikers/i, /zucchero/i, /sugars/i] },
    { key: 'fiber', patterns: [/ballaststoffe/i, /fibres alimentaires/i, /vezels/i, /fibra/i, /fiber/i] },
    { key: 'protein', patterns: [/eiweiß/i, /protéines/i, /eiwitten/i, /proteine/i, /protein/i] },
    { key: 'salt', patterns: [/salz/i, /sel/i, /zout/i, /sale/i, /salt/i] }
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    for (const { key, patterns } of nutritionPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(trimmedLine)) {
          // Try to extract value - look for number followed by unit
          const valueMatch = trimmedLine.match(/(\d+(?:\.\d+)?)\s*(g|kj|kcal|mg|kg|l)/i);
          if (valueMatch) {
            const value = parseFloat(valueMatch[1]);
            const unit = valueMatch[2].toLowerCase();
            
            if (key === 'energy') {
              if (unit === 'kcal') {
                result.energy = value;
              } else if (unit === 'kj') {
                // Convert kJ to kcal (1 kcal = 4.184 kJ)
                result.energy = Math.round(value / 4.184);
              }
            } else if (unit === 'g' || unit === 'mg') {
              if (unit === 'mg' && key !== 'energy') {
                result[key] = value / 1000; // Convert mg to g
              } else {
                result[key] = value;
              }
            }
          }
          break;
        }
      }
    }
  }

  return result;
}

/**
 * Simulates OCR text extraction from an image
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractText(imagePath) {
  // In a real implementation, this would use an OCR library
  // For now, return a simulated response
  return `Nutrition Facts
Serving Size: 100g
Calories: 250
Total Fat: 12g
Saturated Fat: 5g
Total Carbohydrates: 30g
Dietary Fiber: 3g
Sugars: 15g
Protein: 8g
Sodium: 200mg`;
}