import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Package, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ExpiredItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  expired_at: string;
  cost: number;
  image_url: string | null;
  notes: string | null;
  days_expired: number;
}

interface ExpiredItemsCardProps {
  userId: string;
}

/**
 * ExpiredItemsCard Component
 * Displays items that have expired 3+ days ago
 */
export function ExpiredItemsCard({ userId }: ExpiredItemsCardProps) {
  const [expiredItems, setExpiredItems] = useState<ExpiredItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWastedCost, setTotalWastedCost] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpiredItems();
  }, [userId]);

  const fetchExpiredItems = async () => {
    try {
      setLoading(true);
      
      // Calculate the date 3 days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      // Fetch items expired 3+ days ago
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', userId)
        .not('expiry_date', 'is', null)
        .lt('expiry_date', threeDaysAgo.toISOString().split('T')[0])
        .order('expiry_date', { ascending: false });

      if (error) throw error;

      // Calculate days expired for each item
      const itemsWithDays = (data || []).map((item: any) => ({
        ...item,
        days_expired: Math.floor(
          (new Date().getTime() - new Date(item.expiry_date).getTime()) / (1000 * 60 * 60 * 24)
        ),
      }));

      setExpiredItems(itemsWithDays);

      // Calculate total wasted cost
      const totalCost = itemsWithDays.reduce((sum: number, item: any) => sum + (item.cost || 0), 0);
      setTotalWastedCost(totalCost);
    } catch (error) {
      console.error('Error fetching expired items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load expired items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    try {
      // Delete the expired item from inventory
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Item removed',
        description: `${itemName} has been removed from expired items`,
      });

      // Refresh list
      fetchExpiredItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Expired Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Expired Items
            </CardTitle>
            <CardDescription>
              Items expired for 3+ days (automatically moved here)
            </CardDescription>
          </div>
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {expiredItems.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {expiredItems.length === 0 ? (
          <Alert className="border-green-200 bg-green-50">
            <Package className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Great! You have no expired items. Keep up the good work! 🌱
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Total Wasted Cost */}
            {totalWastedCost > 0 && (
              <Alert variant="destructive">
                <DollarSign className="h-4 w-4" />
                <AlertDescription>
                  Total wasted value: <strong>৳{totalWastedCost.toFixed(2)}</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Expired Items List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {expiredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  {/* Item Icon/Image */}
                  <div className="flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-destructive/20 flex items-center justify-center">
                        <Package className="h-6 w-6 text-destructive" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.quantity} {item.unit}
                          </Badge>
                          {item.cost && (
                            <Badge variant="secondary" className="text-xs">
                              ৳{item.cost.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteItem(item.id, item.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Expiry Information */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Expired: {format(new Date(item.expiry_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {item.days_expired} days ago
                      </Badge>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={fetchExpiredItems}
              >
                Refresh
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
