/**
 * OCR module for extracting nutrition info from images
 * Uses Tesseract.js for text recognition
 */

import Tesseract from 'tesseract.js';

/**
 * Extract text from an image file path
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} Extracted text
 */
export async function extractText(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng+deu+nld+ita+fra', {
      logger: m => {
        // Silent logger for production
      }
    });
    return text;
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Extract nutrition information from image text
 * @param {string} text - Extracted text from OCR
 * @returns {Object} Nutrition data
 */
export function extractNutritionFromText(text) {
  const lines = text.split('\n');
  const nutritionKeywords = [
    'energie', 'énergie', 'energie', 'energia',
    'fett', 'matières grasses', 'vetten', 'grassi',
    'kohlenhydrate', 'glucides', 'koolhydraten', 'carboidrati',
    'zucker', 'sucre', 'suiker', 'zuccheri',
    'ballaststoffe', 'fibres alimentaires', 'vezels', 'fibra',
    'eiweiß', 'protéines', 'eiwitten', 'proteine',
    'salz', 'sel', 'zout', 'sale'
  ];

  const nutritionData = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    for (const keyword of nutritionKeywords) {
      if (trimmedLine.toLowerCase().includes(keyword.toLowerCase())) {
        // Try to extract numeric values
        const values = trimmedLine.match(/[\d,]+\.?\d*\s*(g|kj|kcal|mg)?/g);
        if (values) {
          nutritionData[keyword] = values;
        }
        break;
      }
    }
  }

  return nutritionData;
}