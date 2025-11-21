/**
 * Test Gemini API with different configurations
 */

require('dotenv').config();

async function testWithFetch() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  console.log('🧪 Testing Gemini API with direct fetch...\n');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say hello in 3 words'
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      return false;
    }
    
    console.log('✅ Gemini API is working!');
    console.log('📥 Response:', data.candidates[0].content.parts[0].text);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

testWithFetch();
