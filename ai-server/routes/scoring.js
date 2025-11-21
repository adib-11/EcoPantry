const express = require('express');
const router = express.Router();
const { getTextModel } = require('../config/gemini');
const { supabase, fetchUserInventory, fetchUserConsumptions, fetchUserProfile } = require('../config/supabase');
const { buildSdgScoringPrompt } = require('../utils/promptTemplates');

/**
 * POST /api/score
 * Calculate SDG sustainability score for a user
 * 
 * Request body:
 * {
 *   userId: string (UUID)
 * }
 * 
 * Response:
 * {
 *   score: number (0-100),
 *   previousScore: number | null,
 *   trend: 'improving' | 'declining' | 'stable',
 *   breakdown: {
 *     inventoryManagement: number,
 *     loggingConsistency: number,
 *     wasteReduction: number,
 *     diversity: number
 *   },
 *   insights: string[],
 *   nextSteps: string[]
 * }
 */
router.post('/score', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`[SDG Score] Calculating score for user ${userId}`);

    // 1. Fetch user data
    const [inventory, consumptions, profile] = await Promise.all([
      fetchUserInventory(userId),
      fetchUserConsumptions(userId, 7), // Last 7 days
      fetchUserProfile(userId)
    ]);

    const previousScore = profile?.green_score || null;

    // 2. Calculate baseline metrics
    const metrics = calculateMetrics(inventory, consumptions, profile);

    console.log('[SDG Score] Calculated metrics:', JSON.stringify(metrics, null, 2));

    // 3. Build AI prompt for scoring
    const prompt = buildSdgScoringPrompt(metrics, previousScore);

    // 4. Send to Gemini API
    const model = getTextModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log('[SDG Score] Raw AI response:', responseText);

    // 5. Parse AI response (handle markdown wrapping)
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                     responseText.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : responseText;
    const aiResponse = JSON.parse(jsonText);

    // 6. Validate and structure response
    const score = Math.max(0, Math.min(100, aiResponse.score || 50));
    const breakdown = {
      inventoryManagement: Math.max(0, Math.min(100, aiResponse.breakdown?.inventoryManagement || 50)),
      loggingConsistency: Math.max(0, Math.min(100, aiResponse.breakdown?.loggingConsistency || 50)),
      wasteReduction: Math.max(0, Math.min(100, aiResponse.breakdown?.wasteReduction || 50)),
      diversity: Math.max(0, Math.min(100, aiResponse.breakdown?.diversity || 50))
    };

    // 7. Determine trend
    let trend = 'stable';
    if (previousScore !== null) {
      const change = score - previousScore;
      if (change > 5) trend = 'improving';
      else if (change < -5) trend = 'declining';
    }

    // 8. Update user profile with new score
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        green_score: score,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[SDG Score] Failed to update profile:', updateError);
    }

    // 9. Log scoring activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: 'sdg_score_calculated',
        details: {
          score,
          previousScore,
          trend,
          breakdown
        }
      });

    // 10. Return response
    const response = {
      score,
      previousScore,
      trend,
      breakdown,
      insights: aiResponse.insights || [],
      nextSteps: aiResponse.nextSteps || []
    };

    console.log('[SDG Score] Final response:', JSON.stringify(response, null, 2));

    res.json(response);

  } catch (error) {
    console.error('[SDG Score] Error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate score',
      details: error.message 
    });
  }
});

/**
 * Calculate baseline metrics from user data
 */
function calculateMetrics(inventory, consumptions, profile) {
  const now = new Date();
  
  // Inventory metrics
  const totalItems = inventory.length;
  const freshItems = inventory.filter(item => {
    if (!item.expiry_date) return true;
    const expiryDate = new Date(item.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 7;
  }).length;
  
  const expiringItems = inventory.filter(item => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  }).length;
  
  const expiredItems = inventory.filter(item => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    return expiryDate < now;
  }).length;

  // Consumption metrics
  const mealsLogged = consumptions.length;
  const activeDays = new Set(consumptions.map(c => 
    new Date(c.created_at).toISOString().split('T')[0]
  )).size;
  
  // Waste metrics
  const wastedItems = consumptions.flatMap(c => c.wasted_items || []).length;
  
  // Diversity metrics
  const categoriesUsed = new Set(
    consumptions.flatMap(c => {
      const categories = [];
      if (c.proteins) categories.push('proteins');
      if (c.carbs) categories.push('carbs');
      if (c.vegetables) categories.push('vegetables');
      if (c.fruits) categories.push('fruits');
      return categories;
    })
  );

  return {
    inventory: {
      total: totalItems,
      fresh: freshItems,
      expiring: expiringItems,
      expired: expiredItems,
      freshPercentage: totalItems > 0 ? Math.round((freshItems / totalItems) * 100) : 0
    },
    consumption: {
      mealsLogged,
      activeDays,
      daysInPeriod: 7,
      loggingRate: Math.round((activeDays / 7) * 100)
    },
    waste: {
      wastedItems,
      totalItemsUsed: mealsLogged,
      wasteRate: mealsLogged > 0 ? Math.round((wastedItems / mealsLogged) * 100) : 0
    },
    diversity: {
      categoriesUsed: Array.from(categoriesUsed),
      categoryCount: categoriesUsed.size,
      maxCategories: 4 // proteins, carbs, vegetables, fruits
    },
    profile: {
      householdSize: profile?.household_size || 1,
      userType: profile?.user_type || 'individual'
    }
  };
}

module.exports = router;
