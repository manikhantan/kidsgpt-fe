import { Bot } from 'lucide-react';

interface LoadingDotsProps {
  variant?: 'default' | 'simple';
  className?: string;
}

const LoadingDots = ({ variant = 'default', className = '' }: LoadingDotsProps) => {
  if (variant === 'simple') {
    return (
      <div className={`flex justify-start px-4 py-2 ${className}`}>
        <div className="flex gap-1">
          <div className="typing-dot" style={{ animationDelay: '0ms' }} />
          <div className="typing-dot" style={{ animationDelay: '300ms' }} />
          <div className="typing-dot" style={{ animationDelay: '600ms' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`message-container-assistant ${className}`}>
      <div className="message-content">
        <div className="message-avatar-assistant">
          <Bot className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-text-primary">Assistant</span>
          </div>
          <div className="flex gap-1.5">
            <div className="typing-dot" style={{ animationDelay: '0ms' }} />
            <div className="typing-dot" style={{ animationDelay: '300ms' }} />
            <div className="typing-dot" style={{ animationDelay: '600ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDots;
