/**
 * AI Prompt Templates for EcoPantry
 * Provides context-aware prompts for different AI features
 */

/**
 * Build chat system prompt for NourishBot
 * @param {object} userContext - User data (inventory, consumptions, profile)
 * @returns {string} System prompt
 */
const buildChatSystemPrompt = (userContext) => {
  const { inventory = [], consumptions = [], profile = {}, conversationHistory = [] } = userContext;
  
  // Extract key information
  const totalItems = inventory.length;
  const expiringItems = inventory.filter(item => {
    if (!item.expiry_date) return false;
    const daysUntil = Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil > 0;
  });
  
  const recentMeals = consumptions.slice(0, 5).map(c => c.meal_name || 'Unnamed meal');
  
  return `You are NourishBot, a friendly and knowledgeable AI assistant for EcoPantry, a Bangladesh-focused food waste reduction app.

Your Role:
- Help users reduce food waste through practical advice
- Suggest creative recipes using available ingredients
- Provide sustainability tips specific to Bangladeshi context
- Encourage positive behavior with supportive, data-driven insights
- Be culturally aware and respectful

User Context:
- User Type: ${profile.user_type || 'individual'}
- Household Size: ${profile.household_size || '1'} ${profile.household_size > 1 ? 'people' : 'person'}
- Dietary Preference: ${profile.dietary_preference || 'No restrictions'}
- Total Items in Pantry: ${totalItems}
- Items Expiring Soon (7 days): ${expiringItems.length}
${expiringItems.length > 0 ? `- Expiring Items: ${expiringItems.map(i => `${i.name} (${i.quantity} ${i.unit})`).slice(0, 5).join(', ')}` : ''}
- Recent Meals: ${recentMeals.length > 0 ? recentMeals.join(', ') : 'No recent meals logged'}

${conversationHistory.length > 0 ? `Previous Conversation:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}` : ''}

Guidelines:
1. Keep responses concise but helpful (2-4 sentences usually)
2. Prioritize using expiring items in recipe suggestions
3. Use Bangladeshi ingredients and dishes when relevant (rice, dal, roti, fish, curry)
4. Provide specific, actionable advice
5. Be encouraging and positive
6. If user asks about specific items, check their inventory first
7. Respect dietary restrictions
8. Use metric units (kg, L, g, ml)

Response Style:
- Friendly and conversational
- Use emojis occasionally (🍅🥘🌱) but not excessively
- Ask follow-up questions when helpful
- Provide recipes in simple, step-by-step format when requested

Remember: Your goal is to help reduce food waste while making cooking enjoyable and accessible!`;
};

/**
 * Build scoring analysis prompt
 * @param {object} metricsData - Calculated metrics
 * @returns {string} Scoring prompt
 */
const buildScoringPrompt = (metricsData) => {
  const { totalItems, freshItems, expiringItems, expiredItems, mealsLogged, wastedItems, daysActive, categoriesUsed, previousScore } = metricsData;
  
  return `Analyze this user's food waste management data and generate a sustainability score.

Data Summary:
- Total Inventory: ${totalItems} items
- Fresh Items: ${freshItems} (${Math.round((freshItems / totalItems) * 100 || 0)}%)
- Expiring Soon: ${expiringItems}
- Already Expired: ${expiredItems}
- Meals Logged (last 7 days): ${mealsLogged}
- Food Wasted: ${wastedItems} items
- Active Days: ${daysActive}/7
- Food Categories Used: ${categoriesUsed.join(', ') || 'None'}
${previousScore !== null ? `- Previous Score: ${previousScore}/100` : ''}

Task:
Calculate a sustainability score from 0-100 based on:
1. Inventory Management (40%): Low expiry rate, good rotation, minimal expired items
2. Logging Consistency (20%): Regular meal tracking shows awareness
3. Waste Reduction (30%): Minimal wasted items is best
4. Diversity (10%): Variety in food categories indicates balanced diet

Generate 3-5 specific insights about their performance (e.g., "Great job logging meals 6 out of 7 days!", "Dairy waste is 30% - consider buying less").

Provide 2-3 actionable next steps to improve the score.

Return ONLY valid JSON (no markdown):
{
  "score": 75,
  "trend": "improving" | "stable" | "declining",
  "insights": ["insight1", "insight2", "insight3"],
  "nextSteps": ["action1", "action2", "action3"],
  "breakdown": {
    "inventoryManagement": 82,
    "loggingConsistency": 85,
    "wasteReduction": 70,
    "diversity": 65
  }
}`;
};

/**
 * Build pattern analysis prompt
 * @param {object} patternData - Pattern metrics
 * @returns {string} Pattern analysis prompt
 */
const buildPatternAnalysisPrompt = (patternData) => {
  return `Analyze these food consumption patterns and provide insights.

Pattern Data:
${JSON.stringify(patternData, null, 2)}

Tasks:
1. Identify concerning patterns (e.g., over-buying, under-utilization, waste trends)
2. Detect nutritional imbalances (e.g., low vegetable intake, excessive carbs)
3. Find optimization opportunities (e.g., bulk cooking on weekends, meal prep days)
4. Predict items likely to be wasted in next 3-7 days based on patterns
5. Generate heatmap data showing meal frequency by day of week

Return ONLY valid JSON:
{
  "summary": "Brief 1-2 sentence overview of consumption patterns",
  "concerns": ["pattern1", "pattern2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "predictions": {
    "likelyToWaste": ["item1", "item2"],
    "recommendedActions": ["action1", "action2"]
  }
}`;
};

module.exports = {
  buildChatSystemPrompt,
  buildScoringPrompt,
  buildPatternAnalysisPrompt
};
