import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import { useAppSelector } from '@/store/hooks';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import styles from './ParentChatInterface.module.css';

const ParentChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingMessageId,
  } = useAppSelector((state) => state.chat);
  const { sendStreamingMessage } = useStreamingChat('parent');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    // Use streaming chat
    await sendStreamingMessage(content, {
      onError: (error) => {
        console.error('Streaming error:', error);
      },
    });
  };

  const showEmptyState = messages.length === 0 && !isStreaming;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {showEmptyState ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <div className={styles.emptyIconWrapper}>
                <Sparkles className={styles.emptyIcon} />
              </div>
              <h2 className={styles.emptyTitle}>
                How can I help you today?
              </h2>
              <p className={styles.emptyDescription}>
                I'm here to assist you with parenting advice, content control, or any questions you might have.
              </p>
            </div>
          </div>
        ) : (
          <div ref={scrollContainerRef} className={styles.messagesArea}>
            <MessageList messages={messages} streamingMessageId={streamingMessageId} scrollContainerRef={scrollContainerRef} />
          </div>
        )}

        <ChatInput onSend={handleSendMessage} isLoading={isStreaming} />
      </div>
    </div>
  );
};

export default ParentChatInterface;
