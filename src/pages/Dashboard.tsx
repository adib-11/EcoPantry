import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Package, AlertTriangle, CheckCircle, UtensilsCrossed, Leaf, Cloud, DollarSign, ShoppingBag, Utensils, Camera, Lightbulb } from "lucide-react";
import { BorderBeam } from "@/components/animated/BorderBeam";
import { mockGreenScore, mockInventory, mockMealLogs } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserPersona } from "@/contexts/UserPersonaContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userType } = useUserPersona();
  const expiringItems = mockInventory.filter(item => item.status === "expiring");
  const expiredItems = mockInventory.filter(item => item.status === "expired");

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
          savedValue: '32',
          money: 'Budget Saved',
          moneyValue: '৳680'
        };
      case 'community':
        return {
          saved: 'Total Meals Served',
          savedValue: '1,250',
          money: 'Mess Fund Saved',
          moneyValue: '৳8,400'
        };
      default:
        return {
          saved: 'Items Saved',
          savedValue: '24',
          money: 'Money Saved',
          moneyValue: '৳480'
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

  const recentActivity = [
    { 
      type: 'scan', 
      item: 'Miniket Rice (5kg)', 
      time: '2h ago', 
      delta: '+1', 
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      type: 'log', 
      item: 'Chicken Curry', 
      time: '5h ago', 
      delta: '-4 items', 
      icon: Utensils, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100' 
    }
  ];

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
                    mockGreenScore.trend === "up" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {mockGreenScore.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">+{mockGreenScore.change}%</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Score & Progress */}
                  <div className="relative">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-heading text-6xl font-bold text-gradient">
                        {mockGreenScore.current}
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
                            strokeDashoffset: 2 * Math.PI * 88 * (1 - mockGreenScore.current / 100)
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
                          {mockGreenScore.current}
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
                  <p className="font-heading text-2xl font-bold">{mockInventory.length}</p>
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
              className="card-hover-gradient p-6 bg-white border border-slate-100 shadow-sm"
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

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          className="card-hover-gradient p-6 bg-white border border-slate-100 shadow-sm"
        >
          <h3 className="font-heading text-2xl font-semibold mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + index * 0.05, ease: "easeOut" }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`rounded-lg ${activity.bg} p-2`}>
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.item}</p>
                    <p className="text-sm text-muted-foreground">{activity.delta}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.time}
                  </div>
                </motion.div>
              );
            })}

            {mockMealLogs.slice(0, 1).map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + index * 0.05, ease: "easeOut" }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <UtensilsCrossed className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{log.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Used: {log.ingredients.join(", ")}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(log.date).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>

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
      </div>
    </div>
  );
}
