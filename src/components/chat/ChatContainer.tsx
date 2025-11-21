import { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useToast } from '@/hooks/use-toast';
import aiService from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatContainerProps {
  onClose: () => void;
  userId: string;
}

/**
 * ChatContainer Component
 * Main chat interface container with message handling
 */
export function ChatContainer({ onClose, userId }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call AI service
      const response = await aiService.sendChatMessage(content, userId, sessionId || undefined);
      
      // Update session ID
      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
      }

      // Add bot response
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from NourishBot. Please try again.',
        variant: 'destructive',
      });

      // Add error message
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader onClose={onClose} />
      <MessageList 
        messages={messages} 
        isTyping={isTyping}
      />
      <ChatInput 
        onSend={handleSendMessage} 
        disabled={isTyping}
      />
    </div>
  );
}
