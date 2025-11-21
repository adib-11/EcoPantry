import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, LayoutDashboard, Package, UtensilsCrossed, BookOpen, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateInventoryItem } from "@/integrations/supabase/hooks";

export const Navigation = () => {
  const location = useLocation();
  const { toast } = useToast();
  const createItem = useCreateInventoryItem();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [expiryDate, setExpiryDate] = useState("");
  const [cost, setCost] = useState("");
  
  const isActive = (path: string) => location.pathname === path;
  
  // Hide navigation on landing and auth pages
  const hideNav = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";
  
  // Check if user is authenticated (on any page other than landing/auth)
  const isAuthenticated = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register";
  
  const handleSaveItem = async () => {
    if (!itemName || !category || !quantity || !expiryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Parse quantity and unit
      const quantityParts = quantity.trim().split(/\s+/);
      const quantityValue = parseFloat(quantityParts[0]) || 1;
      const unitValue = quantityParts[1] || unit;

      // Create inventory item
      await createItem.mutateAsync({
        name: itemName,
        category: category,
        quantity: quantityValue,
        unit: unitValue,
        expiry_date: expiryDate,
        purchase_date: new Date().toISOString().split('T')[0],
        cost: cost ? parseFloat(cost) : null,
      });

      toast({
        title: "Item Added!",
        description: `${itemName} has been added to your inventory.`,
      });
      
      setSheetOpen(false);
      
      // Reset form
      setItemName("");
      setCategory("");
      setQuantity("");
      setExpiryDate("");
      setCost("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (hideNav) return null;

  // Filter navigation items based on authentication state
  const allNavItems = [
    { path: "/", label: "Home", icon: Leaf },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/inventory", label: "Inventory", icon: Package },
    { path: "/consumptions", label: "Meal Log", icon: UtensilsCrossed },
    { path: "/resources", label: "Resources", icon: BookOpen },
    { path: "/profile", label: "Profile", icon: User },
  ];
  
  // Remove "Home" link when authenticated
  const navItems = isAuthenticated 
    ? allNavItems.filter(item => item.path !== "/")
    : allNavItems;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.1 }}
              className="rounded-xl bg-primary p-2"
            >
              <Leaf className="h-6 w-6 text-white" />
            </motion.div>
            <span className="font-heading text-xl font-bold text-gradient">
              EcoPantry
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-4 py-2 rounded-lg font-medium transition-colors",
                    isActive(item.path)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  <span className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Add Item Sheet */}
          <div className="hidden md:block">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 transition-opacity">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Manual Item</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Miniket Rice"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="meat">Meat & Fish</SelectItem>
                        <SelectItem value="spices">Spices</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      placeholder="e.g., 2 kg or 5"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Include unit if needed (e.g., "2 kg", "5 pcs")
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (৳)</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="e.g., 250"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button 
                    onClick={handleSaveItem}
                    disabled={!itemName || !category || !quantity || !expiryDate || createItem.isPending}
                    className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    {createItem.isPending ? "Saving..." : "Save Item"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden rounded-lg p-2 hover:bg-muted">
            <Package className="h-6 w-6" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
