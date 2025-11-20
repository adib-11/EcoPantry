import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Camera, Package, AlertTriangle, CheckCircle, Clock, Upload, X, Plus, Search, Filter } from "lucide-react";
import { mockInventory } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserPersona } from "@/contexts/UserPersonaContext";

export default function Inventory() {
  const { userType } = useUserPersona();
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [scanStep, setScanStep] = useState<"upload" | "review">("upload");
  const [shopName, setShopName] = useState("");
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("expiry");
  const { toast } = useToast();

  // Dynamic labels based on userType
  const getPageTitle = () => {
    switch (userType) {
      case 'family':
        return 'Household Stock';
      case 'community':
        return 'Store Room Inventory';
      default:
        return 'My Pantry';
    }
  };

  const getScanButtonText = () => {
    if (userType === 'community') {
      return 'Scan Bazar Memo';
    }
    return 'Scan Shopping';
  };

  const getItemSubtitle = (item: typeof mockInventory[0]) => {
    switch (userType) {
      case 'family':
        return 'Bought by Mom';
      case 'community':
        return 'Batch: Nov-15';
      default:
        return item.category;
    }
  };

  const formatQuantity = (item: typeof mockInventory[0]) => {
    if (userType === 'community') {
      // Convert to bulk units for community
      if (item.category === 'Grains' && item.quantity >= 5) {
        return `1 Sack (${item.quantity * 10}kg)`;
      }
      if (item.category === 'Vegetables' && item.quantity >= 2) {
        return `${Math.ceil(item.quantity / 2)} Crates`;
      }
      if (item.category === 'Oils') {
        return `${item.quantity * 5} Bottles`;
      }
    }
    return `${item.quantity} ${item.unit}`;
  };

  const handleStartScan = () => {
    setScanDialogOpen(true);
    setScanStep("upload");
    setShopName("");
    setDetectedItems([]);
    setNewItem("");
  };

  const handleAnalyze = () => {
    // Mock detected items
    setScanStep("review");
    setDetectedItems([
      "Miniket Rice - 5kg",
      "Soybean Oil - 2L",
      "Red Lentils - 1kg",
      "Onions - 2kg"
    ]);
  };

  const handleDeleteItem = (index: number) => {
    setDetectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddNewItem = () => {
    if (newItem.trim()) {
      setDetectedItems(prev => [...prev, newItem]);
      setNewItem("");
    }
  };

  const handleConfirmAdd = () => {
    setScanDialogOpen(false);
    toast({
      title: "Items Added!",
      description: `Successfully added ${detectedItems.length} items to your inventory`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fresh":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "expiring":
        return <AlertTriangle className="h-5 w-5 text-accent" />;
      case "expired":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fresh":
        return "bg-primary/10 text-primary";
      case "expiring":
        return "bg-accent/10 text-accent";
      case "expired":
        return "bg-destructive/10 text-destructive";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h1 className="font-heading text-4xl font-bold mb-2">{getPageTitle()}</h1>
            <p className="text-muted-foreground">
              {mockInventory.length} items • {mockInventory.filter(i => i.status === "expiring").length} expiring soon
            </p>
          </motion.div>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
          className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg border border-slate-100 shadow-sm"
        >
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pantry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="meat">Meat & Fish</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiry">Expiry Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleStartScan}
              className="gradient-primary text-white hover:opacity-90 transition-opacity"
            >
              <Camera className="mr-2 h-5 w-5" />
              {getScanButtonText()}
            </Button>
          </div>
        </motion.div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          className="card-hover-gradient overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b">
                <tr>
                  <th className="text-left p-4 font-heading font-semibold">Item</th>
                  <th className="text-left p-4 font-heading font-semibold">Category</th>
                  <th className="text-left p-4 font-heading font-semibold">Quantity</th>
                  <th className="text-left p-4 font-heading font-semibold">Expiry Date</th>
                  <th className="text-left p-4 font-heading font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockInventory.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.03, ease: "easeOut" }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium block">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{getItemSubtitle(item)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{item.category}</td>
                    <td className="p-4">
                      <span className="font-medium">
                        {formatQuantity(item)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.daysUntilExpiry > 0 
                          ? `${item.daysUntilExpiry} days left`
                          : item.daysUntilExpiry === 0
                          ? "Expires today"
                          : "Expired"
                        }
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="text-sm font-medium capitalize">{item.status}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Scan Dialog */}
        <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {scanStep === "upload" ? "Upload Receipt" : "Review Detected Items"}
              </DialogTitle>
            </DialogHeader>

            {scanStep === "upload" && (
              <div className="space-y-4">
                {/* Dropzone */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or PDF (MAX. 5MB)
                  </p>
                </div>

                {/* Shop Name (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name (Optional)</Label>
                  <Input
                    id="shopName"
                    placeholder="e.g., Agora Supermarket"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleAnalyze}
                  className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  Analyze Receipt
                </Button>
              </div>
            )}

            {scanStep === "review" && (
              <div className="space-y-4">
                {/* Detected Items List */}
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {detectedItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <span className="text-sm">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Missing Item */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add missing item..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddNewItem()}
                  />
                  <Button
                    onClick={handleAddNewItem}
                    disabled={!newItem.trim()}
                    className="gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleConfirmAdd}
                    disabled={detectedItems.length === 0}
                    className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    Add {detectedItems.length} Items to Inventory
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
