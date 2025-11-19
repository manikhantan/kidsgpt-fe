import { Message } from '@/types';
import { formatMessageTime } from '@/utils/formatters';
import { Bot, User, AlertTriangle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import VideoSuggestion from './VideoSuggestion';
import styles from './ChatMessage.module.css';
import { clsx } from 'clsx';

interface ChatMessageProps {
  message: Message;
  compact?: boolean;
  isStreaming?: boolean;
}

const ChatMessage = ({ message, compact = false, isStreaming = false }: ChatMessageProps) => {
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
      <div className={clsx(styles.compactContainer, isUser && styles.compactContainerReverse)}>
        <div
          className={clsx(
            styles.compactAvatar,
            isBlocked ? styles.avatarBlocked : isUser ? styles.avatarUser : styles.avatarAssistant
          )}
        >
          {isBlocked ? (
            <AlertTriangle size={12} />
          ) : isUser ? (
            <User size={12} />
          ) : (
            <Bot size={12} />
          )}
        </div>
        <div className={styles.compactBody}>
          <p className={styles.compactText}>{message.content}</p>
          <span className={styles.compactTime}>
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        styles.container,
        isUser ? styles.containerUser : styles.containerAssistant
      )}
    >
      <div className={styles.content}>
        <div
          className={clsx(
            styles.avatar,
            isBlocked ? styles.avatarBlocked : isUser ? styles.avatarUser : styles.avatarAssistant
          )}
        >
          {isBlocked ? (
            <AlertTriangle size={16} />
          ) : isUser ? (
            <User size={16} />
          ) : (
            <Bot size={16} />
          )}
        </div>

        <div className={styles.messageBody}>
          <div className={styles.header}>
            <span className={styles.senderName}>
              {isBlocked ? 'Blocked' : isUser ? 'You' : 'Assistant'}
            </span>
            <span className={styles.timestamp}>
              {formatMessageTime(message.timestamp)}
            </span>
          </div>

          {isBlocked && (
            <div className={styles.blockedWarning}>
              <AlertTriangle size={16} />
              <span>This content was blocked for safety</span>
            </div>
          )}

          <div className={styles.text}>
            <p>
              {message.content}
              {isStreaming && <span className={styles.cursor} />}
            </p>
          </div>

          {!isUser && !isBlocked && message.videoSuggestion && (
            <VideoSuggestion video={message.videoSuggestion} />
          )}

          {!isUser && !isBlocked && (
            <div className={styles.actions}>
              <button
                onClick={copyToClipboard}
                className={styles.copyButton}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
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
