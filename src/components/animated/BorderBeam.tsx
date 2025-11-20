import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  children: React.ReactNode;
  className?: string;
}

export const BorderBeam = ({ children, className }: BorderBeamProps) => {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Inner content with slight padding to show border */}
      <div className="relative m-[2px] rounded-2xl bg-card">
        {children}
      </div>
    </div>
  );
};
