import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Package, AlertTriangle, CheckCircle, UtensilsCrossed, Leaf, Cloud, DollarSign, ShoppingBag, Utensils, Camera, Lightbulb } from "lucide-react";
import { BorderBeam } from "@/components/animated/BorderBeam";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useUserPersona } from "@/contexts/UserPersonaContext";
import { useProfile, useInventory, useConsumptions } from "@/integrations/supabase/hooks";
import { ExpiredItemsCard } from "@/components/ExpiredItemsCard";
import { useAuth } from "@/integrations/supabase/useAuth";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userType } = useUserPersona();
  const { user } = useAuth();
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  
  // Fetch real data from Supabase
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: inventory = [], isLoading: inventoryLoading } = useInventory();
  const { data: consumptions = [], isLoading: consumptionsLoading } = useConsumptions();
  
  // Calculate stats from real inventory data
  const expiringItems = inventory.filter(item => item.status === "expiring");
  
  // Calculate expired items (3+ days past expiry)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const expiredItems = inventory.filter(item => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    return expiryDate < threeDaysAgo;
  });
  
  const freshItems = inventory.filter(item => item.status === "fresh");
  
  // Calculate green score and trend (using profile data or default)
  const currentScore = profile?.green_score || 0;
  const previousScore = 65; // TODO: Store historical scores to calculate real trend
  const scoreTrend = currentScore >= previousScore ? "up" : "down";
  const scoreChange = Math.abs(currentScore - previousScore);
  
  // Calculate impact stats
  const itemsSaved = freshItems.length;
  const mealCount = consumptions.length;
  
  // Loading state
  const isLoading = profileLoading || inventoryLoading || consumptionsLoading;

  // Dynamic labels based on userType
  const getGreenScoreTitle = () => {
    switch (userType) {
      case 'family':
        return 'Household Score';
      case 'community':
        return 'Mess Efficiency Score';
      default:
        return 'Your Green Score';
    }
  };

  const getImpactLabels = () => {
    switch (userType) {
      case 'family':
        return {
          saved: 'Meals Rescued',
          savedValue: mealCount.toString(),
          money: 'Budget Saved',
          moneyValue: `৳${itemsSaved * 20}` // Rough calculation: 20 BDT per item saved
        };
      case 'community':
        return {
          saved: 'Total Meals Served',
          savedValue: mealCount.toString(),
          money: 'Mess Fund Saved',
          moneyValue: `৳${itemsSaved * 30}` // Higher value for community
        };
      default:
        return {
          saved: 'Items Saved',
          savedValue: itemsSaved.toString(),
          money: 'Money Saved',
          moneyValue: `৳${itemsSaved * 20}` // Rough calculation
        };
    }
  };

  const getActionButtons = () => {
    if (userType === 'community') {
      return {
        scan: 'Scan Bazar Memo',
        log: 'Log Batch Cooking'
      };
    }
    return {
      scan: 'Scan Receipt',
      log: 'Log Meal'
    };
  };

  const impactLabels = getImpactLabels();
  const actionButtons = getActionButtons();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your sustainability impact</p>
        </motion.div>

        {isLoading && inventory.length === 0 && consumptions.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        ) : (
          <>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Green Score Card with Border Beam */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <BorderBeam>
              <div className="p-8 bg-white border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-2xl font-semibold mb-2">{getGreenScoreTitle()}</h3>
                    <p className="text-muted-foreground">Your sustainability rating</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    scoreTrend === "up" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {scoreTrend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">+{scoreChange}%</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Score & Progress */}
                  <div className="relative">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-heading text-6xl font-bold text-gradient">
                        {currentScore}
                      </span>
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                    
                    {/* Circular Progress */}
                    <div className="relative h-48 w-48">
                      <svg className="transform -rotate-90" width="192" height="192">
                        {/* Background circle with subtle fill */}
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="hsl(var(--muted))"
                          strokeWidth="8"
                          fill="hsl(var(--muted) / 0.1)"
                        />
                        {/* Progress circle */}
                        <motion.circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 88}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                          animate={{ 
                            strokeDashoffset: 2 * Math.PI * 88 * (1 - currentScore / 100)
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--teal))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center score display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-heading text-3xl font-bold text-primary">
                          {currentScore}
                        </span>
                        <span className="text-sm text-muted-foreground">Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Impact Stats */}
                  <div className="bg-emerald-50/50 rounded-lg p-6 flex flex-col justify-center">
                    <h4 className="font-heading text-lg font-semibold mb-4">Your Impact</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-100 p-2">
                          <Leaf className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{impactLabels.saved}</p>
                          <p className="font-heading text-2xl font-bold">{impactLabels.savedValue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-sky-100 p-2">
                          <Cloud className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CO₂ Reduced</p>
                          <p className="font-heading text-2xl font-bold">12kg</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-100 p-2">
                          <DollarSign className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{impactLabels.money}</p>
                          <p className="font-heading text-2xl font-bold">{impactLabels.moneyValue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BorderBeam>
          </motion.div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="card-hover-gradient p-6 bg-white border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-emerald-100 p-3">
                  <Package className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="font-heading text-2xl font-bold">{inventory.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
              className="card-hover-gradient p-6 bg-white border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-amber-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="font-heading text-2xl font-bold">{expiringItems.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              className="card-hover-gradient p-6 bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-red-200 transition-colors"
              onClick={() => setShowExpiredModal(true)}
              role="button"
              tabIndex={0}
              aria-label="View expired items details"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="font-heading text-2xl font-bold">{expiredItems.length}</p>
                </div>
              </div>
              {expiredItems.length > 0 && (
                <p className="text-xs text-red-600 mt-2">Click to view details →</p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/inventory')}
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:text-foreground"
            >
              <Camera className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{actionButtons.scan}</p>
                <p className="text-xs text-muted-foreground">Add items quickly</p>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/consumptions')}
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:text-foreground"
            >
              <Utensils className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{actionButtons.log}</p>
                <p className="text-xs text-muted-foreground">Track consumption</p>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/resources')}
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:text-foreground"
            >
              <Lightbulb className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">See Tips</p>
                <p className="text-xs text-muted-foreground">Reduce waste</p>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Expired Items Modal */}
        <Dialog open={showExpiredModal} onOpenChange={setShowExpiredModal}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sr-only">Expired Items Details</DialogTitle>
            </DialogHeader>
            {user && <ExpiredItemsCard userId={user.id} />}
          </DialogContent>
        </Dialog>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
          className="card-hover-gradient p-6 bg-white border border-slate-100 shadow-sm"
        >
          <h3 className="font-heading text-2xl font-semibold mb-6">Recent Activity</h3>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading activity...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consumptions.slice(0, 3).map((consumption, index) => {
                const ingredientsUsed = consumption.ingredients_used as any[] || [];
                const ingredientNames = ingredientsUsed.map((i: any) => i.name || i).join(", ");
                
                return (
                  <motion.div
                    key={consumption.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 + index * 0.05, ease: "easeOut" }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <UtensilsCrossed className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{consumption.meal_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ingredientNames ? `Used: ${ingredientNames}` : 'No ingredients listed'}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {consumption.meal_date ? new Date(consumption.meal_date).toLocaleDateString() : 'No date'}
                    </div>
                  </motion.div>
                );
              })}
              
              {consumptions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No meal logs yet. Start logging your meals to track your consumption!</p>
                </div>
              )}
            </div>
          )}

          {expiringItems.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium text-accent mb-1">Items Expiring Soon</p>
                  <p className="text-sm text-muted-foreground">
                    {expiringItems.map(item => item.name).join(", ")} will expire in the next few days.
                    Check your inventory for recipe suggestions!
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        </>
        )}
      </div>
    </div>
  );
}
