import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { useAuth } from '../useAuth';
import type { Database } from '../types';

type InventoryItem = Database['public']['Tables']['inventory']['Row'];
type InventoryInsert = Database['public']['Tables']['inventory']['Insert'];
type InventoryUpdate = Database['public']['Tables']['inventory']['Update'];

/**
 * Fetch user's inventory with status calculation
 */
export function useInventory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['inventory', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('expiry_date', { ascending: true });

      if (error) throw error;

      // Calculate status for each item
      const itemsWithStatus = data.map(item => {
        const today = new Date();
        const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null;
        
        let status: 'fresh' | 'expiring' | 'expired' = 'fresh';
        let daysUntilExpiry = 0;

        if (expiryDate) {
          const diffTime = expiryDate.getTime() - today.getTime();
          daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (daysUntilExpiry < 0) {
            status = 'expired';
          } else if (daysUntilExpiry <= 7) {
            status = 'expiring';
          } else {
            status = 'fresh';
          }
        }

        return {
          ...item,
          status,
          daysUntilExpiry,
        };
      });

      return itemsWithStatus;
    },
    enabled: !!user,
  });
}

/**
 * Add new inventory item
 */
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (item: Omit<InventoryInsert, 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('inventory')
        .insert({ ...item, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', user?.id] });
    },
  });
}

/**
 * Update inventory item
 */
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: InventoryUpdate }) => {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', user?.id] });
    },
  });
}

/**
 * Delete inventory item
 */
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', user?.id] });
    },
  });
}
