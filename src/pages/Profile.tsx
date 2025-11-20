import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserPersona, UserType } from "@/contexts/UserPersonaContext";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userType, setUserType } = useUserPersona();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [householdSize, setHouseholdSize] = useState("4");
  const [dietaryPreference, setDietaryPreference] = useState("omnivore");
  const [monthlyBudget, setMonthlyBudget] = useState("15000");

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

  const handleSaveChanges = () => {
    toast({
      title: "Profile Updated!",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
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
          <div className="bg-white border border-slate-100 shadow-sm rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-teal p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="font-heading text-3xl font-bold text-white mb-1">{name}</h1>
                  <p className="text-white/90">{email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Edit
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
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  onClick={handleSaveChanges}
                  className="flex-1 gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {getSaveButtonText()}
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
        </motion.div>
      </div>
    </div>
  );
}
