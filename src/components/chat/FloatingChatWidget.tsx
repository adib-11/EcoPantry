import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChatContainer } from './ChatContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingChatWidgetProps {
  userId: string;
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

/**
 * FloatingChatWidget Component
 * Persistent chat button that opens NourishBot from any page
 */
export function FloatingChatWidget({ 
  userId,
  defaultOpen = false,
  position = 'bottom-right'
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  console.log('FloatingChatWidget render - isOpen:', isOpen, 'userId:', userId);

  const toggleChat = () => {
    console.log('toggleChat called, current isOpen:', isOpen);
    setIsOpen(!isOpen);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn('fixed z-50', positionClasses[position])}
          >
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                console.log('Chat button clicked!');
                setIsOpen(true);
              }}
              aria-label="Open NourishBot chat"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            </Button>
            
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary opacity-30 pointer-events-none"
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Sheet (Mobile-friendly) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-[400px] p-0 flex flex-col h-full [&>button]:hidden"
        >
          <ChatContainer onClose={() => setIsOpen(false)} userId={userId} />
        </SheetContent>
      </Sheet>

      {/* Desktop: Fixed panel alternative (optional) */}
      {/* Uncomment this for desktop fixed panel instead of sheet
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className={cn(
              'fixed z-50',
              'hidden md:block',
              'w-[400px] h-[600px]',
              'shadow-2xl rounded-lg overflow-hidden',
              position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'
            )}
          >
            <ChatContainer onClose={() => setIsOpen(false)} userId={userId} />
          </motion.div>
        )}
      </AnimatePresence>
      */}
    </>
  );
}
