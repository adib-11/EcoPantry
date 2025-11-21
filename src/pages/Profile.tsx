import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Save, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserPersona, UserType } from "@/contexts/UserPersonaContext";
import { useProfile, useUpdateProfile } from "@/integrations/supabase/hooks";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/integrations/supabase/storage";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userType, setUserType } = useUserPersona();
  
  // Fetch real profile data from Supabase
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [location, setLocation] = useState("");
  
  // Avatar upload state
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sync form with profile data when loaded
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setEmail(profile.email || "");
      setHouseholdSize(profile.household_size?.toString() || "1");
      setDietaryPreference(profile.dietary_preferences || "omnivore");
      setMonthlyBudget(profile.monthly_budget?.toString() || "");
      setLocation(profile.location || "");
      
      // Sync user type with context if it exists in profile
      if (profile.user_type && profile.user_type !== userType) {
        setUserType(profile.user_type as UserType);
      }
    }
  }, [profile]);

  // Dynamic labels based on userType
  const getNameLabel = () => {
    switch (userType) {
      case 'family':
        return 'Family Representative';
      case 'community':
        return 'Organization Name';
      default:
        return 'Full Name';
    }
  };

  const getHouseholdLabel = () => {
    switch (userType) {
      case 'family':
        return 'Household Members';
      case 'community':
        return 'Total Beneficiaries';
      default:
        return 'Household Size';
    }
  };

  const getHouseholdPlaceholder = () => {
    switch (userType) {
      case 'community':
        return 'e.g., 150 students';
      default:
        return 'Number of people';
    }
  };

  const getBudgetLabel = () => {
    if (userType === 'community') {
      return 'Monthly Mess Fund (৳)';
    }
    return 'Monthly Food Budget (৳)';
  };

  const getSaveButtonText = () => {
    if (userType === 'community') {
      return 'Update Organization Profile';
    }
    return 'Save Changes';
  };

  const handleSaveChanges = async () => {
    try {
      await updateProfile.mutateAsync({
        full_name: name,
        user_type: userType,
        household_size: householdSize ? parseInt(householdSize) : null,
        dietary_preferences: dietaryPreference || null,
        monthly_budget: monthlyBudget ? parseFloat(monthlyBudget) : null,
        location: location || null,
      });
      
      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !profile) return;
    
    setIsUploading(true);
    
    try {
      // Upload to Supabase Storage
      const result = await uploadFile('avatars', selectedFile, profile.id);
      
      if (result.error) throw result.error;
      
      if (!result.data) throw new Error('Upload failed');
      
      // Update profile with new avatar URL
      await updateProfile.mutateAsync({
        avatar_url: result.data.publicUrl,
      });
      
      toast({
        title: "Avatar Updated!",
        description: "Your profile picture has been updated successfully.",
      });
      
      // Close dialog and reset state
      setIsAvatarDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelAvatarUpload = () => {
    setIsAvatarDialogOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          {isLoading ? (
            <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading profile...</p>
            </div>
          ) : (
          <div className="bg-white border border-slate-100 shadow-sm rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-teal p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                    {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="font-heading text-3xl font-bold text-white mb-1">
                    {name || 'User'}
                  </h1>
                  <p className="text-white/90">{email || 'No email'}</p>
                  {profile?.green_score !== undefined && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                      <span className="text-white/90 text-sm">Green Score:</span>
                      <span className="text-white font-bold">{profile.green_score}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => setIsAvatarDialogOpen(true)}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Edit Avatar
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                    <SelectTrigger id="accountType">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="community">Community (Hostel/Mess)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">{getNameLabel()}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="household">{getHouseholdLabel()}</Label>
                  <Input
                    id="household"
                    type="number"
                    min="1"
                    max={userType === 'community' ? '1000' : '20'}
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(e.target.value)}
                    placeholder={getHouseholdPlaceholder()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Preference</Label>
                  <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
                    <SelectTrigger id="dietary">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">Omnivore</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="halal">Halal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">{getBudgetLabel()}</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    placeholder="e.g., 15000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Dhaka, Bangladesh"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  onClick={handleSaveChanges}
                  disabled={updateProfile.isPending}
                  className="flex-1 gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfile.isPending ? 'Saving...' : getSaveButtonText()}
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="destructive"
                  className="flex-1"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>
          )}
        </motion.div>

        {/* Avatar Upload Dialog */}
        <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Profile Picture</DialogTitle>
              <DialogDescription>
                Choose a new profile picture. Supported formats: JPG, PNG, GIF (max 5MB)
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Preview */}
              <div className="flex justify-center">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={previewUrl || profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                    {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* File Input */}
              <div className="space-y-2">
                <Label htmlFor="avatar-upload">Select Image</Label>
                <Input
                  id="avatar-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>
              
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelAvatarUpload}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAvatarUpload}
                disabled={!selectedFile || isUploading}
                className="gradient-primary text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Avatar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
