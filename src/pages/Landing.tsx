import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  TrendingUp, 
  Package, 
  Sparkles, 
  Bell, 
  ChefHat,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { ShimmerButton } from "@/components/animated/ShimmerButton";
import { BentoCard } from "@/components/animated/BentoCard";
import { TypewriterEffect } from "@/components/animated/TypewriterEffect";

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    {
      icon: Package,
      title: "Smart Inventory",
      description: "Track everything in your pantry with AI-powered scanning and automatic expiry alerts.",
    },
    {
      icon: TrendingUp,
      title: "Green Score",
      description: "Gamified sustainability metrics that reward you for reducing waste and making eco-friendly choices.",
    },
    {
      icon: Bell,
      title: "Expiry Alerts",
      description: "Never waste food again with smart notifications when items are about to expire.",
    },
    {
      icon: ChefHat,
      title: "Recipe Suggestions",
      description: "Get personalized recipes based on ingredients that need to be used soon.",
    },
    {
      icon: Sparkles,
      title: "Meal Planning",
      description: "AI-powered meal plans that optimize your inventory and minimize waste.",
    },
    {
      icon: Leaf,
      title: "Impact Tracking",
      description: "See your environmental impact with detailed analytics on waste reduction and savings.",
    },
  ];

  const steps = [
    {
      title: "Scan Your Groceries",
      description: "Simply snap a photo of your shopping receipt or scan individual items",
      visual: "📸",
    },
    {
      title: "Track Everything",
      description: "AI automatically categorizes and tracks expiry dates for all your items",
      visual: "🤖",
    },
    {
      title: "Get Smart Alerts",
      description: "Receive timely notifications before food expires with recipe suggestions",
      visual: "🔔",
    },
    {
      title: "Reduce Waste",
      description: "Watch your Green Score rise as you save money and help the planet",
      visual: "🌍",
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section with Aurora Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Aurora Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-aurora"
            style={{ y }}
          />
          <motion.div
            className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-teal/20 blur-3xl animate-aurora"
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]),
              animationDelay: "2s" 
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-primary-light/20 blur-3xl animate-aurora"
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], ["0%", "40%"]),
              animationDelay: "4s" 
            }}
          />
        </div>

        <motion.div
          style={{ opacity }}
          className="container mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by AI • Zero Waste Future
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            className="mb-6 font-heading text-5xl md:text-7xl font-bold"
          >
            Stop Food Waste,
            <br />
            Start{" "}
            <TypewriterEffect
              words={["Saving Money", "Saving Earth", "Eating Fresh"]}
              className="text-gradient"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground"
          >
            Track your pantry inventory, reduce food waste by 40%, and save hundreds of dollars
            every year with gamified sustainability features.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <ShimmerButton className="px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 inline h-5 w-5" />
              </ShimmerButton>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToFeatures}
              className="rounded-xl border-2 border-primary px-8 py-4 text-lg font-heading font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
              <span>Free forever</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - Bento Grid */}
      <section ref={featuresRef} className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 font-heading text-4xl md:text-5xl font-bold">
              Everything You Need to
              <span className="text-gradient"> Reduce Waste</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features designed to help you save money, reduce waste, and make a
              positive impact on the environment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
              >
                <BentoCard {...feature} gradient />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Sticky Scroll */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 font-heading text-4xl md:text-5xl font-bold">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get started in minutes and start reducing food waste today
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
                className="relative"
              >
                <div className="card-hover-gradient p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-6xl">{step.visual}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-heading text-xl font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                    <ArrowRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-light to-teal">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="mb-4 font-heading text-4xl md:text-5xl font-bold text-white">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
            Join thousands of users who are already reducing food waste and saving money
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-white px-8 py-4 text-lg font-heading font-semibold text-primary shadow-xl hover:shadow-2xl transition-shadow"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 inline h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
