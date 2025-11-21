/**
 * NourishBot Chat Endpoint
 * Provides context-aware conversational AI for food waste reduction
 */

const express = require('express');
const router = express.Router();
const { getTextModel, generateContent } = require('../config/gemini');
const { fetchUserInventory, fetchUserConsumptions, fetchUserProfile, logActivity } = require('../config/supabase');
const { buildChatSystemPrompt } = require('../utils/promptTemplates');

// In-memory session storage (use Redis in production)
const sessions = new Map();

/**
 * POST /api/chat
 * Send a message to NourishBot and get AI response
 * 
 * Request body:
 * {
 *   "message": "What can I cook with expiring tomatoes?",
 *   "userId": "uuid",
 *   "sessionId": "optional-session-id"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "reply": "AI response...",
 *   "sessionId": "uuid",
 *   "context": {
 *     "itemsMentioned": ["tomatoes"],
 *     "suggestedRecipes": ["Tomato Curry"]
 *   }
 * }
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { message, userId, sessionId } = req.body;
    
    // Validate input
    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        error: {
          name: 'ValidationError',
          message: 'message and userId are required'
        }
      });
    }
    
    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          name: 'ValidationError',
          message: 'message cannot be empty'
        }
      });
    }
    
    console.log(`📨 Chat request from user ${userId.substring(0, 8)}...`);
    console.log(`💬 Message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    
    // Fetch user context
    console.log('📊 Fetching user context...');
    const [inventory, consumptions, profile] = await Promise.all([
      fetchUserInventory(userId),
      fetchUserConsumptions(userId, 7),
      fetchUserProfile(userId)
    ]);
    
    console.log(`✅ Context loaded: ${inventory.length} items, ${consumptions.length} recent meals`);
    
    // Get or create session
    const currentSessionId = sessionId || `session_${userId}_${Date.now()}`;
    let conversationHistory = sessions.get(currentSessionId) || [];
    
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    // Keep only last 10 messages to avoid token limits
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }
    
    // Build system prompt with context
    const systemPrompt = buildChatSystemPrompt({
      inventory,
      consumptions,
      profile,
      conversationHistory: conversationHistory.slice(0, -1) // Exclude current message
    });
    
    // Build full prompt
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}\n\nProvide a helpful, friendly response:`;
    
    // Get AI response
    console.log('🤖 Generating AI response...');
    const model = getTextModel();
    const aiResponse = await generateContent(model, fullPrompt);
    
    console.log(`✅ Response generated (${aiResponse.length} chars)`);
    
    // Add bot response to history
    conversationHistory.push({
      role: 'bot',
      content: aiResponse,
      timestamp: new Date()
    });
    
    // Store session
    sessions.set(currentSessionId, conversationHistory);
    
    // Extract context (items mentioned, etc.)
    const context = extractContext(message, aiResponse, inventory);
    
    // Log activity
    await logActivity(userId, 'chat_message', {
      message: message.substring(0, 100),
      responseLength: aiResponse.length,
      sessionId: currentSessionId
    });
    
    // Send response
    res.json({
      success: true,
      reply: aiResponse.trim(),
      sessionId: currentSessionId,
      context
    });
    
  } catch (error) {
    console.error('Chat Error:', error);
    next(error);
  }
});

/**
 * GET /api/chat/sessions/:sessionId
 * Get conversation history for a session
 */
router.get('/chat/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = sessions.get(sessionId) || [];
  
  res.json({
    success: true,
    sessionId,
    messages: history.map(({ role, content, timestamp }) => ({
      role,
      content,
      timestamp
    }))
  });
});

/**
 * DELETE /api/chat/sessions/:sessionId
 * Clear a conversation session
 */
router.delete('/chat/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  sessions.delete(sessionId);
  
  res.json({
    success: true,
    message: 'Session cleared'
  });
});

/**
 * Extract context from message and response
 * @param {string} userMessage - User's message
 * @param {string} botResponse - Bot's response
 * @param {Array} inventory - User's inventory
 * @returns {object} Context object
 */
function extractContext(userMessage, botResponse, inventory) {
  const context = {
    itemsMentioned: [],
    suggestedRecipes: [],
    actionableAdvice: false
  };
  
  // Find mentioned inventory items
  const messageLower = (userMessage + ' ' + botResponse).toLowerCase();
  inventory.forEach(item => {
    if (messageLower.includes(item.name.toLowerCase())) {
      if (!context.itemsMentioned.includes(item.name)) {
        context.itemsMentioned.push(item.name);
      }
    }
  });
  
  // Detect if response contains a recipe (simple heuristic)
  if (botResponse.match(/\d+\.\s|step\s\d+|ingredients?:/i)) {
    context.suggestedRecipes.push('Recipe included');
  }
  
  // Detect actionable advice (simple heuristic)
  if (botResponse.match(/try|consider|you could|i recommend|suggestion:/i)) {
    context.actionableAdvice = true;
  }
  
  return context;
}

// Clean up old sessions (every hour)
setInterval(() => {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  for (const [sessionId, history] of sessions.entries()) {
    const lastMessage = history[history.length - 1];
    if (lastMessage && new Date(lastMessage.timestamp).getTime() < oneDayAgo) {
      sessions.delete(sessionId);
      console.log(`🧹 Cleaned up old session: ${sessionId}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour

module.exports = router;
