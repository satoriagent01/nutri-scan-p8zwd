/**
 * Meal Planner module
 * Manages meal planning and nutrition tracking
 */

/**
 * Create a new meal plan
 * @returns {Object} Empty meal plan
 */
export function createMealPlan() {
  return {
    meals: [],
    products: [],
    dailyTotals: {
      energy: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0,
      sodium: 0
    }
  };
}

/**
 * Add a product to the meal plan
 * @param {Object} mealPlan - The meal plan object
 * @param {Object} product - Product with nutrition data
 * @param {number} weight - Weight in grams
 * @returns {Object} Updated meal plan
 */
export function addProductToMeal(mealPlan, product, weight) {
  const newMeal = {
    id: Date.now(),
    product: product,
    weight: weight,
    timestamp: new Date().toISOString()
  };

  mealPlan.meals.push(newMeal);
  mealPlan.dailyTotals = calculateDailyTotals(mealPlan);

  return mealPlan;
}

/**
 * Remove a meal from the plan
 * @param {Object} mealPlan - The meal plan object
 * @param {number} mealId - ID of the meal to remove
 * @returns {Object} Updated meal plan
 */
export function removeMeal(mealPlan, mealId) {
  mealPlan.meals = mealPlan.meals.filter(meal => meal.id !== mealId);
  mealPlan.dailyTotals = calculateDailyTotals(mealPlan);

  return mealPlan;
}

/**
 * Calculate daily totals from all meals
 * @param {Object} mealPlan - The meal plan object
 * @returns {Object} Daily totals
 */
export function calculateDailyTotals(mealPlan) {
  const totals = {
    energy: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    salt: 0,
    sodium: 0
  };

  for (const meal of mealPlan.meals) {
    const nutrition = calculateNutritionForWeight(meal.product, meal.weight);
    
    for (const [nutrient, value] of Object.entries(nutrition)) {
      if (totals.hasOwnProperty(nutrient)) {
        totals[nutrient] += value;
      }
    }
  }

  // Round to 2 decimal places
  for (const [nutrient, value] of Object.entries(totals)) {
    totals[nutrient] = Math.round(value * 100) / 100;
  }

  return totals;
}

/**
 * Calculate nutrition for a given weight of product
 * @param {Object} product - Product with nutrition data (per 100g)
 * @param {number} weight - Weight in grams
 * @returns {Object} Nutrition values for the given weight
 */
export function calculateNutritionForWeight(product, weight) {
  const result = {};
  const factor = weight / 100;

  if (product.nutrients) {
    for (const [nutrient, data] of Object.entries(product.nutrients)) {
      result[nutrient] = data.value * factor;
    }
  }

  return result;
}

/**
 * Get summary of daily nutrition
 * @param {Object} dailyTotals - Daily totals object
 * @returns {Object} Formatted summary
 */
export function getDailySummary(dailyTotals) {
  return {
    energy: {
      value: Math.round(dailyTotals.energy),
      unit: 'kJ',
      label: 'Energy'
    },
    fat: {
      value: Math.round(dailyTotals.fat * 100) / 100,
      unit: 'g',
      label: 'Fat'
    },
    saturatedFat: {
      value: Math.round(dailyTotals.saturatedFat * 100) / 100,
      unit: 'g',
      label: 'Saturated Fat'
    },
    carbohydrates: {
      value: Math.round(dailyTotals.carbohydrates * 100) / 100,
      unit: 'g',
      label: 'Carbohydrates'
    },
    sugars: {
      value: Math.round(dailyTotals.sugars * 100) / 100,
      unit: 'g',
      label: 'Sugars'
    },
    fiber: {
      value: Math.round(dailyTotals.fiber * 100) / 100,
      unit: 'g',
      label: 'Fiber'
    },
    protein: {
      value: Math.round(dailyTotals.protein * 100) / 100,
      unit: 'g',
      label: 'Protein'
    },
    salt: {
      value: Math.round(dailyTotals.salt * 100) / 100,
      unit: 'g',
      label: 'Salt'
    }
  };
}

/**
 * Add a custom nutrient to tracking
 * @param {Object} mealPlan - The meal plan object
 * @param {string} nutrientName - Name of the custom nutrient
 * @param {number} value - Value to add
 * @returns {Object} Updated meal plan
 */
export function addCustomNutrient(mealPlan, nutrientName, value) {
  if (!mealPlan.dailyTotals.hasOwnProperty(nutrientName)) {
    mealPlan.dailyTotals[nutrientName] = 0;
  }
  
  mealPlan.dailyTotals[nutrientName] += value;
  mealPlan.dailyTotals[nutrientName] = Math.round(mealPlan.dailyTotals[nutrientName] * 100) / 100;

  return mealPlan;
}