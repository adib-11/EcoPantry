/**
 * AI Service Client
 * Handles all communication with the AI server
 */

const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:3000';

/**
 * Base fetch wrapper with error handling
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${AI_SERVER_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

/**
 * Chat with NourishBot
 */
export const sendChatMessage = async (
  message: string,
  userId: string,
  sessionId?: string
) => {
  return apiFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, userId, sessionId }),
  });
};

/**
 * Get SDG sustainability score
 */
export const getSDGScore = async (userId: string) => {
  return apiFetch('/api/score', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
};

/**
 * Scan receipt/image for OCR
 */
export const scanImage = async (formData: FormData) => {
  try {
    const response = await fetch(`${AI_SERVER_URL}/api/scan`, {
      method: 'POST',
      body: formData, // Don't set Content-Type, browser will set it with boundary
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Scan failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Image Scan Error:', error);
    throw error;
  }
};

/**
 * Analyze consumption patterns
 */
export const analyzePatterns = async (
  userId: string,
  timeframe: 'week' | 'month' = 'week'
) => {
  return apiFetch('/api/analyze-patterns', {
    method: 'POST',
    body: JSON.stringify({ userId, timeframe }),
  });
};

/**
 * Predict waste and expiry risks
 */
export const predictWaste = async (userId: string) => {
  return apiFetch('/api/predict-waste', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
};

/**
 * Generate AI meal plan
 */
export const generateMealPlan = async (
  userId: string,
  preferences: {
    days?: number;
    budget?: number;
    dietaryRestriction?: string;
    spiceLevel?: string;
    cookingTime?: string;
    cuisine?: string;
  }
) => {
  return apiFetch('/api/meal-plan', {
    method: 'POST',
    body: JSON.stringify({ userId, ...preferences }),
  });
};

/**
 * Health check
 */
export const checkServerHealth = async () => {
  return apiFetch('/health', {
    method: 'GET',
  });
};

// Export all functions as a default object for convenience
const aiService = {
  sendChatMessage,
  getSDGScore,
  scanImage,
  analyzePatterns,
  predictWaste,
  generateMealPlan,
  checkServerHealth,
};

export default aiService;
