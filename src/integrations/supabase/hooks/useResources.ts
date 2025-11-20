import { useQuery } from '@tanstack/react-query';
import { supabase } from '../client';
import type { Database } from '../types';

type Resource = Database['public']['Tables']['resources']['Row'];

/**
 * Fetch all public resources (tips and recipes)
 */
export function useResources(category?: 'tip' | 'recipe' | 'article' | 'video') {
  return useQuery({
    queryKey: ['resources', category],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        .eq('is_public', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Resource[];
    },
  });
}

/**
 * Fetch sustainability tips
 */
export function useTips() {
  return useResources('tip');
}

/**
 * Fetch recipes
 */
export function useRecipes() {
  return useResources('recipe');
}

/**
 * Get smart recipe recommendations based on expiring inventory
 */
export function useSmartRecipes(expiringItems: string[]) {
  return useQuery({
    queryKey: ['smart-recipes', expiringItems],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'recipe')
        .eq('is_public', true);

      if (error) throw error;

      // Filter recipes that use expiring ingredients
      const recipes = (data as Resource[]).map(recipe => {
        const expiringIngredientsInRecipe = recipe.expiring_ingredients 
          ? (recipe.expiring_ingredients as string[]).filter(ing => 
              expiringItems.some(item => 
                item.toLowerCase().includes(ing.toLowerCase()) || 
                ing.toLowerCase().includes(item.toLowerCase())
              )
            )
          : [];

        return {
          ...recipe,
          matchCount: expiringIngredientsInRecipe.length,
          matchingIngredients: expiringIngredientsInRecipe,
        };
      });

      // Sort by match count (recipes using more expiring items first)
      return recipes
        .filter(r => r.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);
    },
    enabled: expiringItems.length > 0,
  });
}
