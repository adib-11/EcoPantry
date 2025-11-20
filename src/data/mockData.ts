export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: "fresh" | "expiring" | "expired";
  batch?: string; // For community tracking
  purchasedBy?: string; // For family tracking
}

export interface MealLog {
  id: string;
  name: string;
  date: string;
  ingredients: string[];
  image?: string;
  wastedItems?: string[];
  servings?: number; // For family/community tracking
  fedPeople?: number; // For family tracking
}

export interface GreenScore {
  current: number;
  change: number;
  trend: "up" | "down";
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  expiringIngredients: string[];
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

// Mock Bangladeshi inventory items
export const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Hilsha Fish (Ilish)",
    category: "Protein",
    quantity: 2,
    unit: "pieces",
    expiryDate: "2025-11-21",
    daysUntilExpiry: 2,
    status: "expiring",
    batch: "Nov-15",
    purchasedBy: "Mom",
  },
  {
    id: "2",
    name: "Miniket Rice",
    category: "Grains",
    quantity: 5,
    unit: "kg",
    expiryDate: "2026-03-15",
    daysUntilExpiry: 116,
    status: "fresh",
    batch: "Nov-10",
    purchasedBy: "Dad",
  },
  {
    id: "3",
    name: "Mustard Oil",
    category: "Oils",
    quantity: 1,
    unit: "liter",
    expiryDate: "2025-12-31",
    daysUntilExpiry: 42,
    status: "fresh",
    batch: "Nov-12",
    purchasedBy: "Mom",
  },
  {
    id: "4",
    name: "Red Lentils (Masoor Dal)",
    category: "Legumes",
    quantity: 2,
    unit: "kg",
    expiryDate: "2025-11-25",
    daysUntilExpiry: 6,
    status: "expiring",
    batch: "Nov-15",
    purchasedBy: "Dad",
  },
  {
    id: "5",
    name: "Potato",
    category: "Vegetables",
    quantity: 3,
    unit: "kg",
    expiryDate: "2025-11-22",
    daysUntilExpiry: 3,
    status: "expiring",
    batch: "Nov-18",
    purchasedBy: "Mom",
  },
  {
    id: "6",
    name: "Onion",
    category: "Vegetables",
    quantity: 2,
    unit: "kg",
    expiryDate: "2025-12-05",
    daysUntilExpiry: 16,
    status: "fresh",
    batch: "Nov-14",
    purchasedBy: "Dad",
  },
  {
    id: "7",
    name: "Green Chili",
    category: "Spices",
    quantity: 200,
    unit: "grams",
    expiryDate: "2025-11-20",
    daysUntilExpiry: 1,
    status: "expiring",
    batch: "Nov-18",
    purchasedBy: "Mom",
  },
  {
    id: "8",
    name: "Milk",
    category: "Dairy",
    quantity: 2,
    unit: "liters",
    expiryDate: "2025-11-18",
    daysUntilExpiry: -1,
    status: "expired",
    batch: "Nov-16",
    purchasedBy: "Dad",
  },
];

export const mockMealLogs: MealLog[] = [
  {
    id: "1",
    name: "Hilsha Curry",
    date: "2025-11-18",
    ingredients: ["Hilsha Fish", "Mustard Oil", "Green Chili", "Onion"],
    servings: 50,
    fedPeople: 4,
  },
  {
    id: "2",
    name: "Dal with Rice",
    date: "2025-11-17",
    ingredients: ["Red Lentils", "Miniket Rice", "Onion"],
    servings: 50,
    fedPeople: 4,
  },
  {
    id: "3",
    name: "Aloo Bharta",
    date: "2025-11-16",
    ingredients: ["Potato", "Mustard Oil", "Green Chili", "Onion"],
    servings: 50,
    fedPeople: 4,
  },
];

export const mockGreenScore: GreenScore = {
  current: 78,
  change: 12,
  trend: "up",
};

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Quick Potato Curry",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    ingredients: ["Potato", "Onion", "Mustard Oil", "Green Chili"],
    expiringIngredients: ["Potato", "Green Chili"],
    prepTime: "30 min",
    difficulty: "Easy",
  },
  {
    id: "2",
    name: "Spicy Dal Fry",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    ingredients: ["Red Lentils", "Onion", "Green Chili"],
    expiringIngredients: ["Red Lentils"],
    prepTime: "40 min",
    difficulty: "Easy",
  },
  {
    id: "3",
    name: "Hilsha Paturi",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
    ingredients: ["Hilsha Fish", "Mustard Oil", "Green Chili"],
    expiringIngredients: ["Hilsha Fish"],
    prepTime: "45 min",
    difficulty: "Medium",
  },
];

export const sustainabilityTips = [
  {
    title: "FIFO Method",
    description: "First In, First Out - use older items before newer ones to prevent waste.",
    icon: "🔄",
  },
  {
    title: "Proper Storage",
    description: "Store vegetables in the crisper drawer and keep herbs in water like flowers.",
    icon: "❄️",
  },
  {
    title: "Meal Planning",
    description: "Plan your weekly meals based on what's expiring soon in your pantry.",
    icon: "📅",
  },
  {
    title: "Composting",
    description: "Turn unavoidable food waste into nutrient-rich compost for plants.",
    icon: "🌱",
  },
];
