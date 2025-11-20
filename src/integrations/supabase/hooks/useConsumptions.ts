import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { useAuth } from '../useAuth';
import type { Database } from '../types';

type Consumption = Database['public']['Tables']['consumptions']['Row'];
type ConsumptionInsert = Database['public']['Tables']['consumptions']['Insert'];
type ConsumptionUpdate = Database['public']['Tables']['consumptions']['Update'];

/**
 * Fetch user's consumption logs (meal logs)
 */
export function useConsumptions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['consumptions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('consumptions')
        .select('*')
        .eq('user_id', user.id)
        .order('meal_date', { ascending: false });

      if (error) throw error;
      return data as Consumption[];
    },
    enabled: !!user,
  });
}

/**
 * Create new consumption log
 */
export function useCreateConsumption() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (consumption: Omit<ConsumptionInsert, 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('consumptions')
        .insert({ ...consumption, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumptions', user?.id] });
    },
  });
}

/**
 * Update consumption log
 */
export function useUpdateConsumption() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ConsumptionUpdate }) => {
      const { data, error } = await supabase
        .from('consumptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumptions', user?.id] });
    },
  });
}

/**
 * Delete consumption log
 */
export function useDeleteConsumption() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('consumptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumptions', user?.id] });
    },
  });
}
