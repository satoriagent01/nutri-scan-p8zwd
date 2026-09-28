/**
 * Main application entry point
 * CLI interface for the nutrition tracker
 */

import { createMealPlan, addProductToMeal, getDailySummary } from './meal-planner.js';
import { parseNutritionTable } from './nutrition-parser.js';

/**
 * Main function to run the application
 */
export function main() {
  console.log('NutriScan - Free Nutrition Tracker');
  console.log('==================================\n');

  const mealPlan = createMealPlan();

  // Example: Add a product from parsed nutrition data
  const exampleProduct = {
    name: "Chocolate Bar",
    nutrients: {
      energy: { value: 2292, unit: "kJ" },
      fat: { value: 33, unit: "g" },
      saturatedFat: { value: 13, unit: "g" },
      carbohydrates: { value: 55, unit: "g" },
      sugars: { value: 45, unit: "g" },
      fiber: { value: 2.4, unit: "g" },
      protein: { value: 6.8, unit: "g" },
      salt: { value: 0.18, unit: "g" }
    }
  };

  console.log('Adding 50g of Chocolate Bar...');
  addProductToMeal(mealPlan, exampleProduct, 50);

  const summary = getDailySummary(mealPlan.dailyTotals);
  console.log('\nDaily Summary:');
  console.log(`  Energy: ${summary.energy.value} ${summary.energy.unit}`);
  console.log(`  Fat: ${summary.fat.value} ${summary.fat.unit}`);
  console.log(`  Saturated Fat: ${summary.saturatedFat.value} ${summary.saturatedFat.unit}`);
  console.log(`  Carbohydrates: ${summary.carbohydrates.value} ${summary.carbohydrates.unit}`);
  console.log(`  Sugars: ${summary.sugars.value} ${summary.sugars.unit}`);
  console.log(`  Fiber: ${summary.fiber.value} ${summary.fiber.unit}`);
  console.log(`  Protein: ${summary.protein.value} ${summary.protein.unit}`);
  console.log(`  Salt: ${summary.salt.value} ${summary.salt.unit}`);

  console.log('\nNutriScan is ready! Scan your food labels to start tracking.');
}

// Run if called directly
if (import.meta.main) {
  main();
}