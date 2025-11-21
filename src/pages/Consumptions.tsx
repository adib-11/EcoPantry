import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, UtensilsCrossed, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUserPersona } from "@/contexts/UserPersonaContext";
import { useConsumptions, useCreateConsumption, useDeleteConsumption } from "@/integrations/supabase/hooks";

export default function Consumptions() {
  const { userType } = useUserPersona();
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [mealName, setMealName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [servings, setServings] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // Fetch real consumption data from Supabase
  const { data: consumptions = [], isLoading } = useConsumptions();
  const createConsumption = useCreateConsumption();
  const deleteConsumption = useDeleteConsumption();

  // Dynamic labels based on userType
  const getLogButtonText = () => {
    if (userType === 'community') {
      return 'Log Batch Cooking';
    }
    return 'Log Meal';
  };

  const getMealSubtitle = (log: any) => {
    const date = log.meal_date ? new Date(log.meal_date).toLocaleDateString() : 'No date';
    const servingsCount = log.servings || log.fed_people || 1;
    
    switch (userType) {
      case 'family':
        return `${date} • Fed ${log.fed_people || servingsCount} People`;
      case 'community':
        return `${date} • ${servingsCount} Servings`;
      default:
        return date;
    }
  };

  const formatIngredients = (ingredientsUsed: any) => {
    if (!ingredientsUsed) return [];
    
    // Handle both array of objects and array of strings
    let ingredients: string[] = [];
    
    if (Array.isArray(ingredientsUsed)) {
      ingredients = ingredientsUsed.map((item: any) => 
        typeof item === 'string' ? item : (item.name || item)
      );
    }
    
    if (userType === 'community') {
      // Append weights for community (if available in the data)
      return ingredients.map((ingredient: string) => {
        // Try to find quantity info in the original data
        const ingredientObj = Array.isArray(ingredientsUsed) 
          ? ingredientsUsed.find((i: any) => i.name === ingredient || i === ingredient)
          : null;
        
        if (ingredientObj && typeof ingredientObj === 'object' && ingredientObj.quantity) {
          return `${ingredient}: ${ingredientObj.quantity}${ingredientObj.unit || ''}`;
        }
        return ingredient;
      });
    }
    return ingredients;
  };

  const handleLogMeal = async () => {
    if (!mealName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Parse ingredients from text (simple comma-separated)
      const ingredientsArray = ingredientsText
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(item => ({ name: item }));

      await createConsumption.mutateAsync({
        meal_name: mealName,
        meal_date: new Date().toISOString().split('T')[0],
        ingredients_used: ingredientsArray.length > 0 ? ingredientsArray : null,
        servings: servings ? parseInt(servings) : null,
        fed_people: userType === 'family' && servings ? parseInt(servings) : null,
        notes: notes || null,
      });

      setLogDialogOpen(false);
      toast({
        title: "Meal Logged Successfully!",
        description: ingredientsArray.length > 0 
          ? `Logged ${mealName} with ${ingredientsArray.length} ingredients`
          : `Logged ${mealName}`,
      });
      
      // Reset form
      setMealName("");
      setIngredientsText("");
      setServings("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      await deleteConsumption.mutateAsync(id);
      toast({
        title: "Meal Deleted",
        description: "Consumption log removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete meal log. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h1 className="font-heading text-4xl font-bold mb-2">Meal Log</h1>
            <p className="text-muted-foreground">Track what you cook and eat</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
          >
            <Button 
              onClick={() => setLogDialogOpen(true)}
              className="gradient-primary text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2 h-5 w-5" />
              {getLogButtonText()}
            </Button>
          </motion.div>
        </div>

        {/* Meal Logs Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading meal logs...</p>
          </div>
        ) : consumptions.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-heading text-2xl font-semibold mb-2">No Meals Logged Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your meals to see your consumption patterns
            </p>
            <Button 
              onClick={() => setLogDialogOpen(true)}
              className="gradient-primary text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2 h-5 w-5" />
              {getLogButtonText()}
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consumptions.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: "easeOut" }}
              className="card-hover-gradient overflow-hidden"
            >
              {/* Meal Image */}
              {log.image_url && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={log.image_url} 
                    alt={log.meal_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide image container if image fails to load
                      (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold mb-1">{log.meal_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{getMealSubtitle(log)}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMeal(log.id);
                    }}
                    disabled={deleteConsumption.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Ingredients Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {formatIngredients(log.ingredients_used).map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {formatIngredients(log.ingredients_used).length === 0 && (
                      <span className="text-sm text-muted-foreground">No ingredients listed</span>
                    )}
                  </div>
                </div>
                
                {log.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {log.notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Stats Section */}
        {consumptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
          className="mt-8 card-hover-gradient p-8 text-center"
        >
          <h3 className="font-heading text-2xl font-semibold mb-2">
            Keep Logging Your Meals
          </h3>
          <p className="text-muted-foreground mb-4">
            The more you log, the better we can help you reduce waste and save money
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div>
              <p className="text-3xl font-heading font-bold text-gradient mb-2">
                {consumptions.length}
              </p>
              <p className="text-muted-foreground">Meals Logged</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-gradient mb-2">
                {consumptions.reduce((acc, log) => {
                  const ingredients = formatIngredients(log.ingredients_used);
                  return acc + ingredients.length;
                }, 0)}
              </p>
              <p className="text-muted-foreground">Ingredients Used</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-gradient mb-2">
                0
              </p>
              <p className="text-muted-foreground">Items Wasted</p>
            </div>
          </div>
        </motion.div>
        )}

        {/* Log Meal Dialog */}
        <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="e.g., Chicken Biryani"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                <Textarea
                  id="ingredients"
                  placeholder="e.g., Rice, Chicken, Onions, Spices"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Separate each ingredient with a comma
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="servings">
                  {userType === 'family' ? 'People Fed' : 'Servings'}
                </Label>
                <Input
                  id="servings"
                  type="number"
                  placeholder={userType === 'family' ? '4' : '1'}
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleLogMeal}
                disabled={createConsumption.isPending}
                className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
              >
                {createConsumption.isPending ? 'Logging...' : 'Log Meal'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
