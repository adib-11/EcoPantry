import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserPersona, UserType } from "@/contexts/UserPersonaContext";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userType, setUserType } = useUserPersona();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");

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

  const getNamePlaceholder = () => {
    switch (userType) {
      case 'community':
        return 'e.g., Green Valley Hostel';
      default:
        return 'John Doe';
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
        return 'e.g., 150';
      default:
        return 'e.g., 4';
    }
  };

  const getBudgetLabel = () => {
    if (userType === 'community') {
      return 'Monthly Mess Fund (৳)';
    }
    return 'Monthly Food Budget (৳)';
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration
    toast({
      title: "Account created!",
      description: "Welcome to EcoPantry. Let's reduce waste together.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Wavy Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal via-primary-light to-primary">
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320">
            <path
              fill="white"
              fillOpacity="0.3"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                <Leaf className="h-8 w-8" />
              </div>
              <span className="font-heading text-3xl font-bold">EcoPantry</span>
            </div>
            <h1 className="font-heading text-5xl font-bold mb-6">
              Start Your Journey
            </h1>
            <p className="text-xl text-white/90">
              Join thousands reducing food waste and making a real environmental impact.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="rounded-xl bg-primary p-2">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-gradient">
              EcoPantry
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-muted-foreground">
              Sign up to start reducing food waste today
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
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
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={getNamePlaceholder()}
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="household">{getHouseholdLabel()}</Label>
              <Input
                id="household"
                type="number"
                min="1"
                max={userType === 'community' ? '1000' : '20'}
                placeholder={getHouseholdPlaceholder()}
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">{getBudgetLabel()}</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                placeholder="e.g., 15000"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
