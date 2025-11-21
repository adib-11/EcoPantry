const { createClient } = require('@supabase/supabase-js');

// Validate credentials
if (!process.env.SUPABASE_URL) {
  console.error('❌ ERROR: SUPABASE_URL is not set in .env file');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_KEY is not set in .env file');
  console.error('📝 Use the service_role key from Supabase Dashboard → Settings → API');
  process.exit(1);
}

// Initialize Supabase client with service role key
// This bypasses Row Level Security (RLS) - use carefully!
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Fetch user's inventory items
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Inventory items
 */
const fetchUserInventory = async (userId) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Supabase Error (fetchUserInventory):', error);
    throw new Error('Failed to fetch inventory');
  }
  
  return data || [];
};

/**
 * Fetch user's consumption logs
 * @param {string} userId - User UUID
 * @param {number} days - Number of days to fetch (default: 7)
 * @returns {Promise<Array>} Consumption logs
 */
const fetchUserConsumptions = async (userId, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('consumptions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Supabase Error (fetchUserConsumptions):', error);
    throw new Error('Failed to fetch consumption logs');
  }
  
  return data || [];
};

/**
 * Fetch user profile
 * @param {string} userId - User UUID
 * @returns {Promise<object>} User profile
 */
const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Supabase Error (fetchUserProfile):', error);
    throw new Error('Failed to fetch user profile');
  }
  
  return data;
};

/**
 * Update user's green score
 * @param {string} userId - User UUID
 * @param {number} score - New score (0-100)
 * @returns {Promise<object>} Updated profile
 */
const updateGreenScore = async (userId, score) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ green_score: score })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Supabase Error (updateGreenScore):', error);
    throw new Error('Failed to update green score');
  }
  
  return data;
};

/**
 * Log activity (for tracking AI usage, scoring history, etc.)
 * @param {string} userId - User UUID
 * @param {string} activityType - Type of activity
 * @param {object} metadata - Additional data
 * @returns {Promise<object>} Created log entry
 */
const logActivity = async (userId, activityType, metadata = {}) => {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert([{
      user_id: userId,
      activity_type: activityType,
      metadata: metadata,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Supabase Error (logActivity):', error);
    // Don't throw - logging failures shouldn't break the app
    return null;
  }
  
  return data;
};

module.exports = {
  supabase,
  fetchUserInventory,
  fetchUserConsumptions,
  fetchUserProfile,
  updateGreenScore,
  logActivity
};
