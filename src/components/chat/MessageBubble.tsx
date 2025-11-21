import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

/**
 * MessageBubble Component
 * Displays individual chat messages with different styles for user/bot
 */
export function MessageBubble({ 
  message, 
  showAvatar = true, 
  showTimestamp = true 
}: MessageBubbleProps) {
  const isBot = message.role === 'bot';

  return (
    <div className={cn(
      "flex gap-2 mb-4",
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col gap-1",
        isBot ? "items-start" : "items-end",
        "max-w-[85%]"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl",
          isBot 
            ? "bg-muted text-foreground rounded-bl-md" 
            : "bg-primary text-primary-foreground rounded-br-md"
        )}>
          {isBot ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        
        {showTimestamp && (
          <span className="text-xs text-muted-foreground px-1">
            {format(new Date(message.timestamp), 'p')}
          </span>
        )}
      </div>

      {!isBot && showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-accent">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
