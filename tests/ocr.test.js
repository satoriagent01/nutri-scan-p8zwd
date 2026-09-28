import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutritionFromText } from "../src/ocr.js";

describe("OCR Module", () => {
  describe("extractNutritionFromText", () => {
    test("should extract nutrition data from German label", () => {
      const text = `Nährwertdeklaration
Energie 2292 kJ 549 kcal
Fett 33 g
davon gesättigte Fettsäuren 13 g
Kohlenhydrate 55 g
davon Zucker 45 g
Ballaststoffe 2,4 g
Eiweiß 6,8 g
Salz 0,18 g`;

      const result = extractNutritionFromText(text);

      assert.ok(result["energie"]);
      assert.ok(result["fett"]);
      assert.ok(result["kohlenhydrate"]);
      assert.ok(result["zucker"]);
      assert.ok(result["eiweiß"]);
      assert.ok(result["salz"]);
    });

    test("should extract nutrition data from Dutch label", () => {
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

      const result = extractNutritionFromText(text);

      assert.ok(result["energie"]);
      assert.ok(result["vetten"]);
      assert.ok(result["koolhydraten"]);
      assert.ok(result["suikers"]);
      assert.ok(result["vezels"]);
      assert.ok(result["eiwitten"]);
      assert.ok(result["zout"]);
    });

    test("should extract nutrition data from Italian label", () => {
      const text = `Dichiarazione nutrizionale
Energia 2292 kJ 549 kcal
Grassi 33 g
di cui acidi grassi saturi 13 g
Carboidrati 55 g
di cui zuccheri 45 g
Fibre 2,4 g
Proteine 6,8 g
Sale 0,18 g`;

      const result = extractNutritionFromText(text);

      assert.ok(result["energia"]);
      assert.ok(result["grassi"]);
      assert.ok(result["carboidrati"]);
      assert.ok(result["zuccheri"]);
      assert.ok(result["proteine"]);
      assert.ok(result["sale"]);
    });

    test("should extract nutrition data from French label", () => {
      const text = `Déclaration nutritionnelle
Énergie 2292 kJ 549 kcal
Matières grasses 33 g
dont acides gras saturés 13 g
Glucides 55 g
dont sucres 45 g
Fibres alimentaires 2,4 g
Protéines 6,8 g
Sel 0,18 g`;

      const result = extractNutritionFromText(text);

      assert.ok(result["énergie"]);
      assert.ok(result["matières grasses"]);
      assert.ok(result["glucides"]);
      assert.ok(result["sucres"]);
      assert.ok(result["fibres alimentaires"]);
      assert.ok(result["protéines"]);
      assert.ok(result["sel"]);
    });

    test("should return empty object for non-nutrition text", () => {
      const text = `This is just regular text with no nutrition information.
It contains words like hello and world but no nutritional data.`;

      const result = extractNutritionFromText(text);

      assert.deepEqual(result, {});
    });

    test("should handle mixed language text", () => {
      const text = `Nährwertdeklaration / Déclaration nutritionnelle
Energie / énergie 2292 kJ 549 kcal
Fett / matières grasses 33 g
Kohlenhydrate / glucides 55 g`;

      const result = extractNutritionFromText(text);

      assert.ok(result["energie"]);
      assert.ok(result["fett"]);
      assert.ok(result["kohlenhydrate"]);
    });
  });
});