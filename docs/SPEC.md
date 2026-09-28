# NutriScan - Spec

## Overview
A free, ad-free nutrition tracking app that lets users photograph food labels, extract nutrition information via OCR, and track custom meals with flexible gram-based portioning.

## Acceptance Criteria

### AC-1: OCR Extraction
- User can upload an image of a nutrition label
- OCR extracts text from the image
- Returns raw text string for further parsing
- Example: Image of a chocolate bar label → extracts German/Dutch/French nutrition table text

### AC-2: Nutrition Table Parsing
- Parses extracted text into structured nutrition data
- Handles multi-language labels (German, Dutch, French, Italian, Spanish, English)
- Extracts: energy (kJ/kcal), fat, saturated fat, carbohydrates, sugars, fiber, protein, salt
- Returns array of nutrition entries with values per 100g and per serving
- Example from image 1:
  - Energie: 2292 kJ / 549 kcal per 100g, 688 kJ / 165 kcal per 30g
  - Fett: 33g per 100g, 10g per 30g
  - davon gesättigte Fettsäuren: 13g per 100g, 3.9g per 30g
  - Kohlenhydrate: 55g per 100g, 16g per 30g
  - davon Zucker: 45g per 100g, 14g per 30g
  - Ballaststoffe: 2.4g per 100g, 0.7g per 30g
  - Eiweiß: 6.8g per 100g, 2.0g per 30g
  - Salz: 0.18g per 100g, 0.05g per 30g

### AC-3: Meal Planning
- User can create meals with custom ingredients
- Each ingredient has: name, grams, and nutrition data (from OCR or manual entry)
- Calculates total nutrition for the meal
- Example: 150g of product from AC-2 → scales nutrition values proportionally

### AC-4: Custom Tracking
- User can track any nutrition metric (calories, sodium, saturated fat, etc.)
- No predefined categories - fully customizable
- Daily totals across all meals
- Example: Track sodium intake (salt × 2.5 for sodium equivalent)

## Modules

### 1. OCR Module (`src/ocr.js`)
- `extractText(imagePath: string): Promise<string>`
  - Takes path to image file
  - Returns raw text extracted from the image
  - Uses Tesseract.js for OCR

### 2. Nutrition Parser Module (`src/nutrition-parser.js`)
- `parseNutritionTable(text: string): NutritionData[]`
  - Takes raw OCR text
  - Returns array of nutrition entries
  - Each entry: { name, per100g: number, perServing: number, servingSize: string }
  - Handles multi-language labels

### 3. Meal Planner Module (`src/meal-planner.js`)
- `addMeal(meal: Meal): void`
  - Adds a meal to the planner
- `calculateMealNutrition(meal: Meal): NutritionTotals`
  - Calculates total nutrition for a meal based on grams
- `getDailyTotals(): NutritionTotals`
  - Returns daily totals across all meals
- `addIngredient(mealId: string, ingredient: Ingredient): void`
  - Adds an ingredient to a meal

## Data Types

```typescript
interface NutritionEntry {
  name: string;
  per100g: number;
  perServing: number;
  servingSize: string;
}

interface Ingredient {
  name: string;
  grams: number;
  nutrition: NutritionEntry;
}

interface Meal {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

interface NutritionTotals {
  energy: number;
  fat: number;
  saturatedFat: number;
  carbohydrates: number;
  sugars: number;
  fiber: number;
  protein: number;
  salt: number;
}
```