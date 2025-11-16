import { useState, useRef } from 'react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import BlockedNotification from './BlockedNotification';
import { useAppSelector } from '@/store/hooks';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { Sparkles } from 'lucide-react';
import styles from './ChatInterface.module.css';

const ChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingMessageId,
  } = useAppSelector((state) => state.chat);
  const { sendStreamingMessage } = useStreamingChat();
  const [blockedInfo, setBlockedInfo] = useState<{
    show: boolean;
    allowedTopics: string[];
  }>({ show: false, allowedTopics: [] });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    setBlockedInfo({ show: false, allowedTopics: [] });

    // Use streaming chat
    await sendStreamingMessage(content, {
      onBlocked: () => {
        setBlockedInfo({
          show: true,
          allowedTopics: [],
        });
      },
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
                Ask me anything! I'm here to help with homework, answer questions, or just have a conversation.
              </p>
            </div>
          </div>
        ) : (
          <div ref={scrollContainerRef} className={styles.messagesArea}>
            <MessageList messages={messages} streamingMessageId={streamingMessageId} scrollContainerRef={scrollContainerRef} />
            {blockedInfo.show && (
              <div className={styles.blockedNotificationWrapper}>
                <BlockedNotification allowedTopics={blockedInfo.allowedTopics} />
              </div>
            )}
          </div>
        )}

        <ChatInput onSend={handleSendMessage} isLoading={isStreaming} />
      </div>
    </div>
  );
};

export default ChatInterface;
