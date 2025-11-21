/**
 * List available Gemini models
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('📋 Listing available Gemini models...\n');
    
    // Try common model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKS`);
        console.log(`   Response: ${response.text().substring(0, 50)}...`);
        console.log('');
        break; // Found a working model
      } catch (error) {
        console.log(`❌ ${modelName} - ${error.message.substring(0, 80)}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
