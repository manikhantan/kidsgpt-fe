import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSend, isLoading = false, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !isLoading && !disabled) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-surface p-4">
      <form onSubmit={handleSubmit} className="max-w-chat mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message KidsGPT..."
            disabled={isLoading || disabled}
            rows={1}
            className="w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3.5 pr-14
                       text-text-primary placeholder-text-muted resize-none
                       focus:outline-none focus:border-border-dark focus:ring-1 focus:ring-border-dark
                       disabled:bg-surface-tertiary disabled:cursor-not-allowed
                       transition-colors duration-150"
            style={{ minHeight: '52px', maxHeight: '200px' }}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-colors duration-150
                       ${
                         message.trim() && !isLoading && !disabled
                           ? 'bg-text-primary text-surface hover:bg-text-secondary'
                           : 'bg-surface-tertiary text-text-muted cursor-not-allowed'
                       }`}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-text-muted text-center mt-2">
          KidsGPT can make mistakes. Check important info.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
