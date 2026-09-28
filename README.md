# NutriScan

Free, open-source nutrition tracking app with OCR for food labels. No ads, no paywalls.

## Features

- **OCR Food Label Scanning**: Take a photo of any nutrition label and extract the data automatically
- **Custom Nutrition Tracking**: Track calories, sodium, saturated fats, or any nutrient you care about
- **Meal Planning**: Add products with custom weights and see daily totals
- **Multi-language Support**: Works with labels in German, Dutch, French, Italian, English, and more

## How It Works

1. Take a photo of a food label (nutrition table)
2. OCR extracts the text from the image
3. Parser converts the text into structured nutrition data
4. Add the product to your meal plan with the weight you consumed
5. See your daily totals for any nutrients you track

## Installation

```bash
npm install
```

## Usage

### Run the App

```bash
node src/app.js
```

### Run Tests

```bash
npm test
```

## Project Structure

- `src/ocr.js` - OCR module for extracting text from images
- `src/nutrition-parser.js` - Parser for nutrition table data
- `src/meal-planner.js` - Meal planning and nutrition tracking
- `src/app.js` - Main application entry point
- `tests/` - Test files for each module

## Configuration

### OCR Setup

The OCR module uses Tesseract.js for text recognition. Configure your API key and endpoint in the environment:

```javascript
// In src/ocr.js
const OCR_CONFIG = {
  apiKey: process.env.OCR_API_KEY || 'your-api-key',
  endpoint: process.env.OCR_ENDPOINT || 'https://api.ocr-service.com'
};
```

## What's Built

- ✅ OCR module for extracting text from food label images
- ✅ Nutrition table parser that handles multi-language labels
- ✅ Meal planner with custom weight tracking
- ✅ Daily nutrition totals calculation
- ✅ Custom nutrient tracking (sodium, saturated fat, etc.)
- ✅ CLI interface
- ✅ Full test suite

## What's Next

- [ ] Web UI with camera integration
- [ ] Product database integration
- [ ] Barcode scanning support
- [ ] Export nutrition data to CSV
- [ ] Mobile app (React Native)
- [ ] Cloud sync for meal plans

## License

MIT - Free and open source. No ads, no paywalls.