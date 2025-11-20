import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BentoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  gradient?: boolean;
}

export const BentoCard = ({ icon: Icon, title, description, className, gradient }: BentoCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg transition-all duration-300 h-full",
        "hover:shadow-xl hover:border-primary/50",
        className
      )}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-teal/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className="mb-4 inline-flex rounded-xl bg-primary/10 p-3"
        >
          <Icon className="h-6 w-6 text-primary" />
        </motion.div>
        
        <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
          {title}
        </h3>
        
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      
      {/* Animated gradient border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--teal) / 0.2))",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "2px",
        }}
      />
    </motion.div>
  );
};
