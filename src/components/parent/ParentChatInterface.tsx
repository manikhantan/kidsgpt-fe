import { useEffect } from 'react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { useLazyGetParentChatSessionQuery } from '@/store/api/apiSlice';
import { setCurrentSession } from '@/store/slices/chatSlice';

const ParentChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingMessageId,
    currentSessionId,
    currentSessionTitle,
  } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { sendStreamingMessage } = useStreamingChat('parent');
  const [getSession] = useLazyGetParentChatSessionQuery();

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
    // Use streaming chat
    await sendStreamingMessage(content, currentSessionId, {
      onError: (error) => {
        console.error('Streaming error:', error);
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <MessageList messages={messages} streamingMessageId={streamingMessageId} />
        </div>

        <ChatInput onSend={handleSendMessage} isLoading={isStreaming} />
      </div>
    </div>
  );
};

export default ParentChatInterface;
