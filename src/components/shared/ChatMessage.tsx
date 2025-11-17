import { Message } from '@/types';
import { formatMessageTime } from '@/utils/formatters';
import { Bot, User, AlertTriangle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
  compact?: boolean;
}

const ChatMessage = ({ message, compact = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const isBlocked = message.blocked;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className={`flex gap-3 py-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div
          className={`w-6 h-6 rounded-sm flex-shrink-0 flex items-center justify-center text-xs font-medium ${
            isBlocked
              ? 'bg-warning-light text-warning-dark'
              : isUser
              ? 'bg-accent text-white'
              : 'bg-surface-dark text-white'
          }`}
        >
          {isBlocked ? (
            <AlertTriangle className="h-3 w-3" />
          ) : isUser ? (
            <User className="h-3 w-3" />
          ) : (
            <Bot className="h-3 w-3" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary break-words">{message.content}</p>
          <span className="text-xs text-text-muted mt-1 block">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`message-animate group ${
        isUser ? 'message-container-user' : 'message-container-assistant'
      }`}
    >
      <div className="message-content">
        <div
          className={`message-avatar ${
            isBlocked
              ? 'bg-warning-light'
              : isUser
              ? 'message-avatar-user'
              : 'message-avatar-assistant'
          }`}
        >
          {isBlocked ? (
            <AlertTriangle className="h-4 w-4 text-warning-dark" />
          ) : isUser ? (
            'U'
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-text-primary">
              {isBlocked ? 'Blocked' : isUser ? 'You' : 'Assistant'}
            </span>
            <span className="text-xs text-text-muted">
              {formatMessageTime(message.timestamp)}
            </span>
          </div>

          {isBlocked && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-warning-light rounded-lg">
              <AlertTriangle className="h-4 w-4 text-warning-dark" />
              <span className="text-sm font-medium text-warning-dark">
                This content was blocked for safety
              </span>
            </div>
          )}

          <div className="message-text">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          {!isUser && !isBlocked && (
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
