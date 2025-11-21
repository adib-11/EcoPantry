import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

/**
 * TypingIndicator Component
 * Displays animated dots when NourishBot is typing
 */
export function TypingIndicator() {
  return (
    <motion.div 
      className="flex items-center gap-2 p-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">NourishBot is typing...</span>
    </motion.div>
  );
}
