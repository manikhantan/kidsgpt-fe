import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './ChatInput.module.css';
import { clsx } from 'clsx';

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

  const isSendEnabled = message.trim() && !isLoading && !disabled;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message KidsGPT..."
            disabled={isLoading || disabled}
            rows={1}
            className={styles.textarea}
          />
          <button
            type="submit"
            disabled={!isSendEnabled}
            className={clsx(
              styles.sendButton,
              isSendEnabled ? styles.sendButtonActive : styles.sendButtonDisabled
            )}
          >
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <ArrowUp size={20} strokeWidth={2.5} />
            )}
          </button>
        </div>
        <p className={styles.disclaimer}>
          KidsGPT can make mistakes. Check important info.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
