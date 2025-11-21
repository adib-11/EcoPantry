const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY is not set in .env file');
  console.error('📝 Get your API key from: https://makersuite.google.com/app/apikey');
  process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get Gemini text model for chat, analysis, and predictions
 * @param {string} modelName - Model name (default: gemini-2.5-flash)
 * @returns {object} Generative model instance
 */
const getTextModel = (modelName = 'gemini-2.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Get Gemini vision model for image analysis and OCR
 * @param {string} modelName - Model name (default: gemini-2.5-flash)
 * @returns {object} Generative model instance
 */
const getVisionModel = (modelName = 'gemini-2.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Generate content with error handling and retry logic
 * @param {object} model - Gemini model instance
 * @param {string|object} prompt - Text prompt or multimodal content
 * @returns {Promise<string>} Generated text response
 */
const generateContent = async (model, prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    
    // Handle specific error types
    if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('safety')) {
      throw new Error('Content was blocked by safety filters.');
    } else {
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }
};

/**
 * Parse JSON response from Gemini (handles markdown code blocks)
 * @param {string} text - Raw response text
 * @returns {object} Parsed JSON object
 */
const parseJsonResponse = (text) => {
  try {
    // Remove markdown code blocks if present
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    console.error('Raw text:', text);
    throw new Error('Failed to parse AI response as JSON');
  }
};

module.exports = {
  getTextModel,
  getVisionModel,
  generateContent,
  parseJsonResponse
};
