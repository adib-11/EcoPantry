import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card3D } from "@/components/animated/Card3D";
import { Clock, ChefHat, Flame } from "lucide-react";
import { useTips, useRecipes } from "@/integrations/supabase/hooks";

export default function Resources() {
  const { data: tips = [], isLoading: tipsLoading } = useTips();
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes();
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-bold mb-2">Resources</h1>
          <p className="text-muted-foreground">
            Tips, recipes, and meal plans to help you reduce waste
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="tips" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tips">Sustainability Tips</TabsTrigger>
            <TabsTrigger value="meals">Smart Meal Planner</TabsTrigger>
          </TabsList>

          {/* Sustainability Tips */}
          <TabsContent value="tips" className="space-y-6">
            {tipsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading tips...</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {tips.map((tip, index) => (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: "easeOut" }}
                      className="card-hover-gradient p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{tip.icon || '💡'}</div>
                        <div>
                          <h3 className="font-heading text-xl font-semibold mb-2">
                            {tip.title}
                          </h3>
                          <p className="text-muted-foreground">{tip.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Additional Tips Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
                  className="card-hover-gradient p-8"
                >
                  <h2 className="font-heading text-2xl font-semibold mb-4">
                    Food Waste Facts
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                      <p className="text-4xl font-heading font-bold text-gradient mb-2">
                        1.3B
                      </p>
                      <p className="text-muted-foreground">
                        Tonnes of food wasted globally each year
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <p className="text-4xl font-heading font-bold text-gradient mb-2">
                        40%
                      </p>
                      <p className="text-muted-foreground">
                        Of food waste happens at home
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <p className="text-4xl font-heading font-bold text-gradient mb-2">
                        $2500
                      </p>
                      <p className="text-muted-foreground">
                        Average household food waste cost/year
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </TabsContent>

          {/* Smart Meal Planner */}
          <TabsContent value="meals" className="space-y-6">
            {recipesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading recipes...</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
                  className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/20"
                >
                  <p className="text-sm">
                    <span className="font-semibold">💡 Smart Suggestion:</span> These recipes use
                    ingredients that are expiring soon in your pantry
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe, index) => {
                    const ingredients = (recipe.ingredients as string[]) || [];
                    const expiringIngredients = (recipe.expiring_ingredients as string[]) || [];
                    
                    return (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: "easeOut" }}
                      >
                        <Card3D>
                          {/* Recipe Image */}
                          <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                            <img
                              src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                              alt={recipe.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                              {expiringIngredients.length > 0 && (
                                <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                                  Uses Expiring Items
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Recipe Info */}
                          <h3 className="font-heading text-xl font-semibold mb-2">
                            {recipe.title}
                          </h3>

                          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{recipe.prep_time || '30 min'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="h-4 w-4" />
                              <span>{recipe.difficulty || 'Easy'}</span>
                            </div>
                          </div>

                          {/* Ingredients */}
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Ingredients:</p>
                            <div className="flex flex-wrap gap-2">
                              {ingredients.map((ingredient) => (
                                <span
                                  key={ingredient}
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    expiringIngredients.includes(ingredient)
                                      ? "bg-accent/10 text-accent"
                                      : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Cook Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-medium text-white hover:shadow-lg transition-shadow"
                          >
                            <ChefHat className="mr-2 inline h-4 w-4" />
                            View Recipe
                          </motion.button>
                        </Card3D>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
