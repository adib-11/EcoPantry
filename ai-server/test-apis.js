/**
 * Test script to verify Gemini and Supabase API connections
 * Run with: node test-apis.js
 */

require('dotenv').config();
const { getTextModel, generateContent } = require('./config/gemini');
const { supabase, fetchUserProfile } = require('./config/supabase');

async function testGeminiAPI() {
  console.log('\n🧪 Testing Gemini API...');
  console.log('═══════════════════════════════════════');
  
  try {
    const model = getTextModel();
    const prompt = "Say 'Hello from Gemini!' in exactly 5 words.";
    
    console.log('📤 Sending test prompt...');
    const response = await generateContent(model, prompt);
    
    console.log('✅ Gemini API is working!');
    console.log('📥 Response:', response.trim());
    return true;
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    return false;
  }
}

async function testSupabaseAPI() {
  console.log('\n🧪 Testing Supabase API...');
  console.log('═══════════════════════════════════════');
  
  try {
    // Test 1: Check connection
    console.log('📤 Testing database connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (tablesError) {
      throw tablesError;
    }
    
    console.log('✅ Database connection successful!');
    
    // Test 2: Try to fetch a profile (if any exist)
    if (tables && tables.length > 0) {
      console.log('📤 Testing profile fetch...');
      const profile = await fetchUserProfile(tables[0].id);
      console.log('✅ Profile fetch successful!');
      console.log('📥 Sample profile:', {
        id: profile.id,
        full_name: profile.full_name,
        user_type: profile.user_type,
        green_score: profile.green_score
      });
    } else {
      console.log('ℹ️  No profiles in database yet (this is OK for new setup)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Supabase API Error:', error.message);
    return false;
  }
}

async function testAll() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   API Connection Test Suite          ║');
  console.log('╚═══════════════════════════════════════╝');
  
  const geminiOk = await testGeminiAPI();
  const supabaseOk = await testSupabaseAPI();
  
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   Test Results                        ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log(`Gemini API:   ${geminiOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`Supabase API: ${supabaseOk ? '✅ Working' : '❌ Failed'}`);
  
  if (geminiOk && supabaseOk) {
    console.log('\n🎉 All APIs are working correctly!');
    console.log('✅ Ready to implement Task 1.2 (Chat Backend)');
  } else {
    console.log('\n⚠️  Some APIs failed. Check the errors above.');
    console.log('📝 Verify your .env file has correct API keys.');
  }
  
  console.log('\n');
  process.exit(geminiOk && supabaseOk ? 0 : 1);
}

// Run tests
testAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
