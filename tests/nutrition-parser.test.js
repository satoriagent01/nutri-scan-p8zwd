import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { parseNutritionTable, calculateNutritionForWeight } from "../src/nutrition-parser.js";

describe("Nutrition Parser Module", () => {
  describe("parseNutritionTable", () => {
    test("should parse German nutrition table", () => {
      const text = `Nährwertdeklaration
Energie 2292 kJ 549 kcal
Fett 33 g
davon gesättigte Fettsäuren 13 g
Kohlenhydrate 55 g
davon Zucker 45 g
Ballaststoffe 2,4 g
Eiweiß 6,8 g
Salz 0,18 g`;

      const result = parseNutritionTable(text);

      assert.equal(result.nutrients.energy.value, 2292);
      assert.equal(result.nutrients.fat.value, 33);
      assert.equal(result.nutrients.saturatedFat.value, 13);
      assert.equal(result.nutrients.carbohydrates.value, 55);
      assert.equal(result.nutrients.sugars.value, 45);
      assert.equal(result.nutrients.fiber.value, 2.4);
      assert.equal(result.nutrients.protein.value, 6.8);
      assert.equal(result.nutrients.salt.value, 0.18);
    });

    test("should parse Dutch nutrition table", () => {
      const text = `Voedingswaarde per 100 ml
energie 199 kJ / 47 kcal
vetten, waarvan 0 g
- verzadigde vetzuren 0 g
- onverzadigde vetzuren 0 g
koolhydraten, waarvan 11 g
- suikers 10 g
- zoetstoffen 0 g
vezels 0,7 g
eiwitten 0,4 g
zout 0 g`;

      const result = parseNutritionTable(text);

      assert.equal(result.nutrients.energy.value, 199);
      assert.equal(result.nutrients.fat.value, 0);
      assert.equal(result.nutrients.saturatedFat.value, 0);
      assert.equal(result.nutrients.carbohydrates.value, 11);
      assert.equal(result.nutrients.sugars.value, 10);
      assert.equal(result.nutrients.fiber.value, 0.7);
      assert.equal(result.nutrients.protein.value, 0.4);
      assert.equal(result.nutrients.salt.value, 0);
    });

    test("should parse Italian nutrition table", () => {
      const text = `Dichiarazione nutrizionale
Energia 2292 kJ 549 kcal
Grassi 33 g
di cui acidi grassi saturi 13 g
Carboidrati 55 g
di cui zuccheri 45 g
Fibre 2,4 g
Proteine 6,8 g
Sale 0,18 g`;

      const result = parseNutritionTable(text);

      assert.equal(result.nutrients.energy.value, 2292);
      assert.equal(result.nutrients.fat.value, 33);
      assert.equal(result.nutrients.saturatedFat.value, 13);
      assert.equal(result.nutrients.carbohydrates.value, 55);
      assert.equal(result.nutrients.sugars.value, 45);
      assert.equal(result.nutrients.fiber.value, 2.4);
      assert.equal(result.nutrients.protein.value, 6.8);
      assert.equal(result.nutrients.salt.value, 0.18);
    });

    test("should parse French nutrition table", () => {
      const text = `Déclaration nutritionnelle
Énergie 2292 kJ 549 kcal
Matières grasses 33 g
dont acides gras saturés 13 g
Glucides 55 g
dont sucres 45 g
Fibres alimentaires 2,4 g
Protéines 6,8 g
Sel 0,18 g`;

      const result = parseNutritionTable(text);

      assert.equal(result.nutrients.energy.value, 2292);
      assert.equal(result.nutrients.fat.value, 33);
      assert.equal(result.nutrients.saturatedFat.value, 13);
      assert.equal(result.nutrients.carbohydrates.value, 55);
      assert.equal(result.nutrients.sugars.value, 45);
      assert.equal(result.nutrients.fiber.value, 2.4);
      assert.equal(result.nutrients.protein.value, 6.8);
      assert.equal(result.nutrients.salt.value, 0.18);
    });

    test("should return empty nutrients for non-nutrition text", () => {
      const text = `This is just regular text with no nutrition information.`;

      const result = parseNutritionTable(text);

      assert.deepEqual(result.nutrients, {});
    });

    test("should extract serving information", () => {
      const text = `1 L / 5 porties (200 ml)
Voedingswaarde per 100 ml
energie 199 kJ / 47 kcal`;

      const result = parseNutritionTable(text);

      assert.equal(result.servingInfo.standardServing.amount, 200);
      assert.equal(result.servingInfo.standardServing.unit, 'ml');
    });
  });

  describe("calculateNutritionForWeight", () => {
    test("should calculate nutrition for 50g from 100g base", () => {
      const nutritionData = {
        nutrients: {
          energy: { value: 2292, unit: 'kJ' },
          fat: { value: 33, unit: 'g' },
          protein: { value: 6.8, unit: 'g' }
        }
      };

      const result = calculateNutritionForWeight(nutritionData, 50);

      assert.equal(result.energy.value, 1146);
      assert.equal(result.fat.value, 16.5);
      assert.equal(result.protein.value, 3.4);
    });

    test("should calculate nutrition for 150g from 100g base", () => {
      const nutritionData = {
        nutrients: {
          energy: { value: 2292, unit: 'kJ' },
          fat: { value: 33, unit: 'g' },
          protein: { value: 6.8, unit: 'g' }
        }
      };

      const result = calculateNutritionForWeight(nutritionData, 150);

      assert.equal(result.energy.value, 3438);
      assert.equal(result.fat.value, 49.5);
      assert.equal(result.protein.value, 10.2);
    });

    test("should calculate nutrition for 100g from 100g base", () => {
      const nutritionData = {
        nutrients: {
          energy: { value: 2292, unit: 'kJ' },
          fat: { value: 33, unit: 'g' },
          protein: { value: 6.8, unit: 'g' }
        }
      };

      const result = calculateNutritionForWeight(nutritionData, 100);

      assert.equal(result.energy.value, 2292);
      assert.equal(result.fat.value, 33);
      assert.equal(result.protein.value, 6.8);
    });
  });
});