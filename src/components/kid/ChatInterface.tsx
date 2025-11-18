import { useState, useEffect } from 'react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import BlockedNotification from './BlockedNotification';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { useLazyGetChatSessionQuery } from '@/store/api/apiSlice';
import { setCurrentSession } from '@/store/slices/chatSlice';
import { Sparkles } from 'lucide-react';

const ChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingMessageId,
    currentSessionId,
    currentSessionTitle,
  } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { sendStreamingMessage } = useStreamingChat();
  const [getSession] = useLazyGetChatSessionQuery();
  const [blockedInfo, setBlockedInfo] = useState<{
    show: boolean;
    allowedTopics: string[];
  }>({ show: false, allowedTopics: [] });

  // Load session messages if we have a persisted session ID but no messages
  useEffect(() => {
    const loadPersistedSession = async () => {
      if (currentSessionId && messages.length === 0 && !isStreaming) {
        try {
          const fullSession = await getSession(currentSessionId).unwrap();
          dispatch(
            setCurrentSession({
              id: fullSession.id,
              title: fullSession.title || currentSessionTitle,
              messages: fullSession.messages,
            })
          );
        } catch (err) {
          console.error('Failed to load persisted session:', err);
          // If session fails to load, clear it to allow starting fresh
          dispatch(setCurrentSession({ id: null, title: null, messages: [] }));
        }
      }
    };
    loadPersistedSession();
  }, [currentSessionId, messages.length, isStreaming, getSession, dispatch, currentSessionTitle]);

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
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col min-h-0">
        {showEmptyState ? (
          <div className="flex-1 flex items-center justify-center bg-surface">
            <div className="text-center max-w-2xl mx-auto px-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-surface-dark to-gray-800 flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-text-primary mb-3 tracking-tight">
                How can I help you today?
              </h2>
              <p className="text-base text-text-secondary leading-relaxed">
                Ask me anything! I'm here to help with homework, answer questions, or just have a conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <MessageList messages={messages} streamingMessageId={streamingMessageId} />
            {blockedInfo.show && (
              <div className="max-w-3xl mx-auto px-6 pb-4">
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
