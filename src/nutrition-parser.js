/**
 * Nutrition parser module
 * Parses nutrition table data into structured format
 */

/**
 * Parse a nutrition table string into structured data
 * @param {string} text - OCR extracted text containing nutrition info
 * @returns {Object} Structured nutrition data
 */
export function parseNutritionTable(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const nutritionData = {
    nutrients: {},
    servingInfo: {},
    ingredients: []
  };

  // Parse serving information
  const servingPatterns = [
    /(\d+)\s*(g|ml|portions?|portie|porzione)/i,
    /(\d+)\s*=\s*(\d+)\s*(g|ml)/i,
    /(\d+)\s*portions?\s*\(?\s*(\d+)\s*(ml|g)/i
  ];

  for (const line of lines) {
    for (const pattern of servingPatterns) {
      const match = line.match(pattern);
      if (match) {
        if (match.length === 3) {
          nutritionData.servingInfo.standardServing = {
            amount: parseInt(match[1]),
            unit: match[2].toLowerCase()
          };
          if (match[3]) {
            nutritionData.servingInfo.alternativeServing = {
              amount: parseInt(match[3]),
              unit: match[2].toLowerCase()
            };
          }
        } else if (match.length === 4) {
          nutritionData.servingInfo.standardServing = {
            amount: parseInt(match[1]),
            unit: match[2].toLowerCase()
          };
          nutritionData.servingInfo.alternativeServing = {
            amount: parseInt(match[3]),
            unit: match[4].toLowerCase()
          };
        }
        break;
      }
    }
  }

  // Parse nutrition values
  const nutrientPatterns = [
    { name: 'energy', keywords: ['energie', 'énergie', 'energia', 'energy'], unit: ['kJ', 'kcal'] },
    { name: 'fat', keywords: ['fett', 'matières grasses', 'vetten', 'grassi', 'fat'], unit: ['g'] },
    { name: 'saturatedFat', keywords: ['gesättigte Fettsäuren', 'acides gras saturés', 'verzadigde vetzuren', 'acidi grassi saturi', 'saturated fat'], unit: ['g'] },
    { name: 'carbohydrates', keywords: ['kohlenhydrate', 'glucides', 'koolhydraten', 'carboidrati', 'carbohydrates'], unit: ['g'] },
    { name: 'sugars', keywords: ['zucker', 'sucres', 'suiker', 'zuccheri', 'sugars'], unit: ['g'] },
    { name: 'fiber', keywords: ['ballaststoffe', 'fibres alimentaires', 'vezels', 'fibra', 'fiber'], unit: ['g'] },
    { name: 'protein', keywords: ['eiweiß', 'protéines', 'eiwitten', 'proteine', 'protein'], unit: ['g'] },
    { name: 'salt', keywords: ['salz', 'sel', 'zout', 'sale', 'salt'], unit: ['g', 'mg'] },
    { name: 'sodium', keywords: ['natrium', 'sodium'], unit: ['mg', 'g'] }
  ];

  let currentNutrient = null;
  let values = [];

  for (const line of lines) {
    let matched = false;

    for (const nutrient of nutrientPatterns) {
      for (const keyword of nutrient.keywords) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          currentNutrient = nutrient.name;
          values = [];
          
          // Extract values (per 100g/ml and per serving)
          const valueMatches = line.match(/[\d,]+\.?\d*\s*(g|kj|kcal|mg)?/g);
          if (valueMatches) {
            values = valueMatches.map(v => {
              const numMatch = v.match(/([\d,]+\.?\d*)\s*(g|kj|kcal|mg)?/);
              if (numMatch) {
                return {
                  value: parseFloat(numMatch[1].replace(',', '.')),
                  unit: numMatch[2] || ''
                };
              }
              return null;
            }).filter(v => v !== null);
          }
          
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (matched) continue;

    // Handle "davon" / "dont" / "waarvan" / "di cui" (of which)
    if (line.toLowerCase().includes('davon') || 
        line.toLowerCase().includes('dont') || 
        line.toLowerCase().includes('waarvan') || 
        line.toLowerCase().includes('di cui')) {
      
      const subNutrients = {
        'saturatedFat': ['gesättigte Fettsäuren', 'acides gras saturés', 'verzadigde vetzuren', 'acidi grassi saturi'],
        'sugars': ['zucker', 'sucres', 'suiker', 'zuccheri'],
        'fiber': ['ballaststoffe', 'fibres', 'vezels', 'fibra']
      };

      for (const [subNutrient, keywords] of Object.entries(subNutrients)) {
        for (const keyword of keywords) {
          if (line.toLowerCase().includes(keyword.toLowerCase())) {
            const valueMatch = line.match(/([\d,]+\.?\d*)\s*(g|kj|kcal|mg)?/);
            if (valueMatch) {
              nutritionData.nutrients[subNutrient] = {
                value: parseFloat(valueMatch[1].replace(',', '.')),
                unit: valueMatch[2] || 'g',
                parent: currentNutrient
              };
            }
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
    }

    // Extract ingredients
    if (line.toLowerCase().includes('ingred') || line.toLowerCase().includes('bestandde')) {
      const ingredientsText = line.split(':').pop().trim();
      if (ingredientsText) {
        nutritionData.ingredients.push(ingredientsText);
      }
    }
  }

  // Store main nutrients
  for (const line of lines) {
    for (const nutrient of nutrientPatterns) {
      for (const keyword of nutrient.keywords) {
        if (line.toLowerCase().includes(keyword.toLowerCase()) && 
            !line.toLowerCase().includes('davon') && 
            !line.toLowerCase().includes('dont') &&
            !line.toLowerCase().includes('waarvan') &&
            !line.toLowerCase().includes('di cui')) {
          
          const valueMatch = line.match(/([\d,]+\.?\d*)\s*(g|kj|kcal|mg)?/);
          if (valueMatch) {
            nutritionData.nutrients[nutrient.name] = {
              value: parseFloat(valueMatch[1].replace(',', '.')),
              unit: valueMatch[2] || 'g'
            };
          }
        }
      }
    }
  }

  return nutritionData;
}

/**
 * Calculate nutrition for a given weight of product
 * @param {Object} nutritionData - Parsed nutrition data (per 100g)
 * @param {number} weight - Weight in grams
 * @returns {Object} Nutrition values for the given weight
 */
export function calculateNutritionForWeight(nutritionData, weight) {
  const result = {};
  const factor = weight / 100;

  for (const [nutrient, data] of Object.entries(nutritionData.nutrients)) {
    result[nutrient] = {
      value: data.value * factor,
      unit: data.unit
    };
  }

  return result;
}