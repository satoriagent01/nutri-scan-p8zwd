import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  createMealPlan,
  addProductToMeal,
  removeMeal,
  calculateDailyTotals,
  calculateNutritionForWeight,
  getDailySummary,
  addCustomNutrient
} from "../src/meal-planner.js";

describe("Meal Planner Module", () => {
  describe("createMealPlan", () => {
    test("should create an empty meal plan", () => {
      const plan = createMealPlan();

      assert.equal(plan.meals.length, 0);
      assert.equal(plan.products.length, 0);
      assert.equal(plan.dailyTotals.energy, 0);
      assert.equal(plan.dailyTotals.fat, 0);
    });
  });

  describe("addProductToMeal", () => {
    test("should add a product to the meal plan", () => {
      const plan = createMealPlan();
      const product = {
        name: "Chocolate Bar",
        nutrients: {
          energy: { value: 2292, unit: "kJ" },
          fat: { value: 33, unit: "g" },
          protein: { value: 6.8, unit: "g" }
        }
      };

      const updatedPlan = addProductToMeal(plan, product, 50);

      assert.equal(updatedPlan.meals.length, 1);
      assert.equal(updatedPlan.meals[0].product.name, "Chocolate Bar");
      assert.equal(updatedPlan.meals[0].weight, 50);
    });

    test("should calculate correct totals for 50g of product", () => {
      const plan = createMealPlan();
      const product = {
        name: "Chocolate Bar",
        nutrients: {
          energy: { value: 2292, unit: "kJ" },
          fat: { value: 33, unit: "g" },
          protein: { value: 6.8, unit: "g" }
        }
      };

      addProductToMeal(plan, product, 50);

      assert.equal(plan.dailyTotals.energy, 1146);
      assert.equal(plan.dailyTotals.fat, 16.5);
      assert.equal(plan.dailyTotals.protein, 3.4);
    });

    test("should add multiple products and sum totals", () => {
      const plan = createMealPlan();
      const product1 = {
        name: "Chocolate Bar",
        nutrients: {
          energy: { value: 2292, unit: "kJ" },
          fat: { value: 33, unit: "g" }
        }
      };
      const product2 = {
        name: "Apple",
        nutrients: {
          energy: { value: 218, unit: "kJ" },
          fat: { value: 0.2, unit: "g" }
        }
      };

      addProductToMeal(plan, product1, 50);
      addProductToMeal(plan, product2, 100);

      assert.equal(plan.dailyTotals.energy, 1364);
      assert.equal(plan.dailyTotals.fat, 16.7);
    });
  });

  describe("removeMeal", () => {
    test("should remove a meal and recalculate totals", () => {
      const plan = createMealPlan();
      const product = {
        name: "Chocolate Bar",
        nutrients: {
          energy: { value: 2292, unit: "kJ" },
          fat: { value: 33, unit: "g" }
        }
      };

      addProductToMeal(plan, product, 50);
      const mealId = plan.meals[0].id;

      removeMeal(plan, mealId);

      assert.equal(plan.meals.length, 0);
      assert.equal(plan.dailyTotals.energy, 0);
      assert.equal(plan.dailyTotals.fat, 0);
    });
  });

  describe("calculateNutritionForWeight", () => {
    test("should calculate nutrition for 50g from 100g base", () => {
      const product = {
        nutrients: {
          energy: { value: 2292, unit: "kJ" },
          fat: { value: 33, unit: "g" }
        }
      };

      const result = calculateNutritionForWeight(product, 50);

      assert.equal(result.energy, 1146);
      assert.equal(result.fat, 16.5);
    });

    test("should calculate nutrition for 200g from 100g base", () => {
      const product = {
        nutrients: {
          energy: { value: 2292, unit: "kJ" },
          fat: { value: 33, unit: "g" }
        }
      };

      const result = calculateNutritionForWeight(product, 200);

      assert.equal(result.energy, 4584);
      assert.equal(result.fat, 66);
    });
  });

  describe("getDailySummary", () => {
    test("should return formatted daily summary", () => {
      const dailyTotals = {
        energy: 2292,
        fat: 33,
        saturatedFat: 13,
        carbohydrates: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        salt: 0.18
      };

      const summary = getDailySummary(dailyTotals);

      assert.equal(summary.energy.value, 2292);
      assert.equal(summary.energy.unit, "kJ");
      assert.equal(summary.fat.value, 33);
      assert.equal(summary.fat.unit, "g");
      assert.equal(summary.protein.value, 6.8);
      assert.equal(summary.protein.unit, "g");
    });
  });

  describe("addCustomNutrient", () => {
    test("should add a custom nutrient to tracking", () => {
      const plan = createMealPlan();

      addCustomNutrient(plan, "sodium", 500);

      assert.equal(plan.dailyTotals.sodium, 500);
    });

    test("should add to existing custom nutrient", () => {
      const plan = createMealPlan();

      addCustomNutrient(plan, "sodium", 500);
      addCustomNutrient(plan, "sodium", 300);

      assert.equal(plan.dailyTotals.sodium, 800);
    });
  });
});