# NutriScan - Development Plan

## Overview

NutriScan is a free, open-source nutrition tracking application that uses OCR to extract nutrition information from food labels. Users can track any nutrient they care about (calories, sodium, saturated fats, etc.) without paywalls or ads.

## Architecture

### Stack
- **Runtime**: Node.js 24
- **Testing**: Node.js built-in test runner
- **OCR**: Tesseract.js for text recognition from images
- **Language**: JavaScript (ES Modules)

### Modules

1. **OCR Module** (`src/ocr.js`)
   - Extracts text from food label images
   - Configurable API endpoint and key
   - Returns raw text for parsing

2. **Nutrition Parser** (`src/nutrition-parser.js`)
   - Parses OCR text into structured nutrition data
   - Handles multi-language labels (German, Dutch, French, Italian, English)
   - Extracts: energy, fat, saturated fat, carbohydrates, sugars, fiber, protein, salt

3. **Meal Planner** (`src/meal-planner.js`)
   - Manages meal plans with custom product weights
   - Calculates daily nutrition totals
   - Supports tracking any nutrient

4. **App** (`src/app.js`)
   - CLI interface
   - Orchestrates the modules

## Key Decisions

### 1. OCR with AI
- Use Tesseract.js for OCR as requested
- Configurable API endpoint and key for flexibility
- Raw text output passed to deterministic parser

### 2. Deterministic Parsing
- After OCR extracts text, use regex and parsing rules to extract nutrition values
- Handle multiple languages by recognizing common patterns
- Parse nutrition tables with various column formats (per 100g, per serving, etc.)

### 3. Custom Tracking
- No predefined nutrient limits
- Users track whatever they want (calories, sodium, saturated fat, etc.)
- Daily totals calculated from all products added

### 4. Free and Open
- No ads, no paywalls
- MIT license
- All features available to everyone

## Testing Strategy

- Unit tests for each module
- Tests use real examples from food labels (German, Dutch, French)
- No network calls in tests
- Test coverage for parsing various label formats

## Future Work

- Web UI with camera integration
- Product database integration
- Barcode scanning
- Export functionality
- Mobile app

## Files

- `docs/SPEC.md` - Detailed specification
- `src/` - Source code modules
- `tests/` - Test files
- `README.md` - User documentation