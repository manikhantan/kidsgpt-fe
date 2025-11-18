import { useState } from 'react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import BlockedNotification from './BlockedNotification';
import { useAppSelector } from '@/store/hooks';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { Sparkles } from 'lucide-react';

const ChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingMessageId,
    currentSessionId,
  } = useAppSelector((state) => state.chat);
  const { sendStreamingMessage } = useStreamingChat();
  const [blockedInfo, setBlockedInfo] = useState<{
    show: boolean;
    allowedTopics: string[];
  }>({ show: false, allowedTopics: [] });

  const handleSendMessage = async (content: string) => {
    setBlockedInfo({ show: false, allowedTopics: [] });

    // Use streaming chat
    await sendStreamingMessage(content, currentSessionId, {
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
    <div className="flex flex-col h-full bg-surface">
      <div className="flex-1 flex flex-col min-h-0">
        {showEmptyState ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-dark flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                How can I help you today?
              </h2>
              <p className="text-text-secondary">
                Ask me anything! I'm here to help with homework, answer questions, or just have a conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} streamingMessageId={streamingMessageId} />
            {blockedInfo.show && (
              <BlockedNotification allowedTopics={blockedInfo.allowedTopics} />
            )}
          </div>
        )}

        <ChatInput onSend={handleSendMessage} isLoading={isStreaming} />
      </div>
    </div>
  );
};

export default ChatInterface;
