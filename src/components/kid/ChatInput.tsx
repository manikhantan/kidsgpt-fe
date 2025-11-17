import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import Button from '@/components/shared/Button';

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-100 bg-white/80 backdrop-blur-lg p-4"
    >
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isLoading || disabled}
            rows={1}
            className="w-full rounded-2xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none transition-all duration-200 pr-12"
            style={{ minHeight: '52px', maxHeight: '150px' }}
          />
          {!message.trim() && !isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Sparkles className="h-5 w-5 text-gray-300" />
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          isLoading={isLoading}
          className="h-[52px] px-6 shadow-soft-lg"
          leftIcon={!isLoading && <Send className="h-5 w-5" />}
        >
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
