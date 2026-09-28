/**
 * OCR Module - Extracts nutrition information from text
 * Uses AI-powered OCR to extract nutrition data from product labels
 */

/**
 * Extracts text from an image using AI-powered OCR
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} Extracted text from the image
 */
export async function extractText(imagePath) {
  // In a real implementation, this would call an OCR API (e.g., Google Vision, Tesseract)
  // For now, we simulate OCR by returning the image path
  // The actual OCR would be done via an AI service
  return `Simulated OCR result for ${imagePath}`;
}

/**
 * Extracts nutrition information from OCR text
 * @param {string} text - OCR-extracted text from the image
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
    servingWeight: null,
    unit: 'g'
  };

  // Normalize text for matching
  const normalizedText = text.toLowerCase();

  // Extract serving size information
  const servingMatch = normalizedText.match(/(?:serving|portie|porción|portion|porzione)\s*(?:size|size|tamaño|dimensione)?[:\s]*([0-9]+)\s*(g|ml|kg|l)/i);
  if (servingMatch) {
    result.servingWeight = parseInt(servingMatch[1]);
    result.unit = servingMatch[2];
  }

  // Extract energy values
  const energyMatch = normalizedText.match(/(?:energy|energie|energia|calorías|calorias|calorías|calorie)\s*[:\s]*([0-9]+)\s*(kj|kcal)/i);
  if (energyMatch) {
    result.energy = {
      value: parseInt(energyMatch[1]),
      unit: energyMatch[2]
    };
  }

  // Extract fat values
  const fatMatch = normalizedText.match(/(?:fat|vet|grasa|gras|grassi)\s*[:\s]*([0-9.]+)\s*g/i);
  if (fatMatch) {
    result.fat = parseFloat(fatMatch[1]);
  }

  // Extract saturated fat values
  const satFatMatch = normalizedText.match(/(?:saturated\s*fat|vetzuren|gras\s*saturado|gras\s*saturé|grassi\s*saturi)\s*[:\s]*([0-9.]+)\s*g/i);
  if (satFatMatch) {
    result.saturatedFat = parseFloat(satFatMatch[1]);
  }

  // Extract carbohydrate values
  const carbMatch = normalizedText.match(/(?:carbohydrate|koolhydraat|carbohidrato|glucide|carboidrato)\s*[:\s]*([0-9.]+)\s*g/i);
  if (carbMatch) {
    result.carbohydrates = parseFloat(carbMatch[1]);
  }

  // Extract sugar values
  const sugarMatch = normalizedText.match(/(?:sugar|suiker|azúcar|sucre|zucchero|sucre)\s*[:\s]*([0-9.]+)\s*g/i);
  if (sugarMatch) {
    result.sugars = parseFloat(sugarMatch[1]);
  }

  // Extract fiber values
  const fiberMatch = normalizedText.match(/(?:fiber|vezel|fibra|fibre|fibra)\s*[:\s]*([0-9.]+)\s*g/i);
  if (fiberMatch) {
    result.fiber = parseFloat(fiberMatch[1]);
  }

  // Extract protein values
  const proteinMatch = normalizedText.match(/(?:protein|eiwit|proteína|protéine|proteina)\s*[:\s]*([0-9.]+)\s*g/i);
  if (proteinMatch) {
    result.protein = parseFloat(proteinMatch[1]);
  }

  // Extract salt/sodium values
  const saltMatch = normalizedText.match(/(?:salt|zout|sal|sel|sale)\s*[:\s]*([0-9.]+)\s*g/i);
  if (saltMatch) {
    result.salt = parseFloat(saltMatch[1]);
  }

  return result;
}