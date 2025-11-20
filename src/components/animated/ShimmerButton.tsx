import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ShimmerButton = ({ children, className, onClick }: ShimmerButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative overflow-hidden rounded-xl px-8 py-4 font-heading font-semibold text-white shadow-lg transition-shadow hover:shadow-xl",
        "gradient-primary",
        className
      )}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 animate-shimmer" />
    </motion.button>
  );
};
