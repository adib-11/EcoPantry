import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Camera, Package, AlertTriangle, CheckCircle, Clock, Upload, X, Plus, Search, Filter, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserPersona } from "@/contexts/UserPersonaContext";
import { useInventory, useCreateInventoryItem, useUpdateInventoryItem, useDeleteInventoryItem } from "@/integrations/supabase/hooks";
import { uploadFile } from "@/integrations/supabase/storage";
import { useAuth } from "@/integrations/supabase/useAuth";

export default function Inventory() {
  const { userType } = useUserPersona();
  const { user } = useAuth();
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [scanStep, setScanStep] = useState<"upload" | "review">("upload");
  const [shopName, setShopName] = useState("");
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("expiry");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Fetch real inventory data from Supabase
  const { data: inventory = [], isLoading, error } = useInventory();
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  // Filter and sort inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventory;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "expiry":
          if (!a.expiry_date) return 1;
          if (!b.expiry_date) return -1;
          return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [inventory, searchQuery, categoryFilter, sortBy]);

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

  const getItemSubtitle = (item: any) => {
    switch (userType) {
      case 'family':
        return item.purchased_by || 'Household';
      case 'community':
        return item.batch || 'Batch: Nov-15';
      default:
        return item.category;
    }
  };

  const formatQuantity = (item: any) => {
    const qty = item.quantity || 0;
    const unit = item.unit || 'pcs';
    
    if (userType === 'community') {
      // Convert to bulk units for community
      if (item.category === 'Grains' && qty >= 5) {
        return `1 Sack (${qty * 10}kg)`;
      }
      if (item.category === 'Vegetables' && qty >= 2) {
        return `${Math.ceil(qty / 2)} Crates`;
      }
      if (item.category === 'Oils') {
        return `${qty * 5} Bottles`;
      }
    }
    return `${qty} ${unit}`;
  };

  const handleStartScan = () => {
    setScanDialogOpen(true);
    setScanStep("upload");
    setShopName("");
    setDetectedItems([]);
    setNewItem("");
    setReceiptFile(null);
    setReceiptImageUrl(null);
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!receiptFile) {
      toast({
        title: "No Receipt Selected",
        description: "Please upload a receipt image first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload receipt to Supabase Storage
      if (user) {
        const uploadResult = await uploadFile('receipts', receiptFile, user.id);
        
        if (uploadResult.error) {
          throw new Error("Failed to upload receipt");
        }

        // Store the receipt image URL
        if (uploadResult.data) {
          setReceiptImageUrl(uploadResult.data.publicUrl);
        }

        toast({
          title: "Receipt Uploaded",
          description: "Analyzing receipt...",
        });
      }

      // Mock detected items (in production, this would use OCR/AI)
      setScanStep("review");
      setDetectedItems([
        "Miniket Rice - 5kg",
        "Soybean Oil - 2L",
        "Red Lentils - 1kg",
        "Onions - 2kg"
      ]);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not upload receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({
        title: "Item Deleted",
        description: "Item removed from inventory successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDetectedItem = (index: number) => {
    setDetectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddNewItem = () => {
    if (newItem.trim()) {
      setDetectedItems(prev => [...prev, newItem]);
      setNewItem("");
    }
  };

  const handleConfirmAdd = async () => {
    try {
      // Parse detected items and create inventory items
      for (const itemText of detectedItems) {
        // Simple parsing - in production, this would be more sophisticated
        const parts = itemText.split('-').map(p => p.trim());
        const name = parts[0] || itemText;
        const quantityPart = parts[1] || '1';
        
        // Extract quantity and unit
        const quantityMatch = quantityPart.match(/(\d+(?:\.\d+)?)\s*(\w+)?/);
        const quantity = quantityMatch ? parseFloat(quantityMatch[1]) : 1;
        const unit = quantityMatch?.[2] || 'pcs';
        
        // Create item in database with receipt image
        await createItem.mutateAsync({
          name,
          category: 'General', // Default category
          quantity,
          unit,
          purchase_date: new Date().toISOString().split('T')[0],
          image_url: receiptImageUrl, // Use the receipt image for all items from this scan
          // Add optional fields based on user type
          ...(userType === 'family' && { purchased_by: 'Household' }),
          ...(userType === 'community' && { batch: `Batch-${new Date().toISOString().split('T')[0]}` }),
        });
      }
      
      setScanDialogOpen(false);
      toast({
        title: "Items Added!",
        description: `Successfully added ${detectedItems.length} items to your inventory`,
      });
      
      // Reset state
      setDetectedItems([]);
      setShopName("");
      setScanStep("upload");
      setReceiptImageUrl(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add items. Please try again.",
        variant: "destructive",
      });
    }
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
              {inventory.length} items • {inventory.filter(i => i.status === "expiring").length} expiring soon
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
                <SelectItem value="spices">Spices</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
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
                  <th className="text-left p-4 font-heading font-semibold">Image</th>
                  <th className="text-left p-4 font-heading font-semibold">Item</th>
                  <th className="text-left p-4 font-heading font-semibold">Category</th>
                  <th className="text-left p-4 font-heading font-semibold">Quantity</th>
                  <th className="text-left p-4 font-heading font-semibold">Expiry Date</th>
                  <th className="text-left p-4 font-heading font-semibold">Status</th>
                  <th className="text-left p-4 font-heading font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                      <p className="mt-4 text-muted-foreground">Loading inventory...</p>
                    </td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground">
                      {searchQuery || categoryFilter !== "all" 
                        ? "No items found matching your filters"
                        : "No items in your inventory yet. Start by scanning a receipt or adding items manually."}
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.03, ease: "easeOut" }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Package className={`h-8 w-8 text-muted-foreground ${item.image_url ? 'hidden' : ''}`} />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
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
                          {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'No expiry date'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.daysUntilExpiry !== undefined && item.daysUntilExpiry > 0 
                          ? `${item.daysUntilExpiry} days left`
                          : item.daysUntilExpiry === 0
                          ? "Expires today"
                          : item.daysUntilExpiry !== undefined && item.daysUntilExpiry < 0
                          ? "Expired"
                          : "No expiry"
                        }
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${getStatusColor(item.status || 'fresh')}`}>
                        {getStatusIcon(item.status || 'fresh')}
                        <span className="text-sm font-medium capitalize">{item.status || 'fresh'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deleteItem.isPending}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
                )}
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
                <div className="space-y-2">
                  <Label>Receipt Image</Label>
                  <label 
                    htmlFor="receipt-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  >
                    <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
                    {receiptFile ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          {receiptFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(receiptFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or PDF (MAX. 5MB)
                        </p>
                      </>
                    )}
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleReceiptFileChange}
                    />
                  </label>
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
                  disabled={!receiptFile || isUploading}
                  className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  {isUploading ? "Uploading..." : "Analyze Receipt"}
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
                          onClick={() => handleDeleteDetectedItem(index)}
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
