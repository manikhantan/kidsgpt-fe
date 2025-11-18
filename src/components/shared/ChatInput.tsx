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
    <div className="border-t border-border bg-surface px-4 py-4 md:py-6">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message KidsGPT..."
            disabled={isLoading || disabled}
            rows={1}
            className="w-full rounded-3xl border border-border bg-surface px-5 py-4 pr-14
                       text-text-primary placeholder-text-muted resize-none
                       focus:outline-none focus:border-text-primary/30 focus:shadow-sm
                       disabled:bg-surface-secondary disabled:cursor-not-allowed
                       transition-all duration-200"
            style={{ minHeight: '56px', maxHeight: '200px' }}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className={`absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200
                       ${
                         message.trim() && !isLoading && !disabled
                           ? 'bg-text-primary text-white hover:bg-text-secondary shadow-sm'
                           : 'bg-border text-text-muted cursor-not-allowed'
                       }`}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
        <p className="text-xs text-text-muted text-center mt-3 px-2">
          KidsGPT can make mistakes. Check important info.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
