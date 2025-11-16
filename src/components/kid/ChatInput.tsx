import { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/shared/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSend, isLoading = false, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');

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

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
    >
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isLoading || disabled}
            rows={1}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            style={{ minHeight: '50px', maxHeight: '150px' }}
          />
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          isLoading={isLoading}
          className="h-[50px] px-6"
          leftIcon={!isLoading && <Send className="h-5 w-5" />}
        >
          Send
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
