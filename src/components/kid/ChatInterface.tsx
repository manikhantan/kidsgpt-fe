import { useState } from 'react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import LoadingDots from '@/components/shared/LoadingDots';
import BlockedNotification from './BlockedNotification';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addMessage,
  setChatLoading,
  setCurrentSession,
  setCurrentSessionTitle,
} from '@/store/slices/chatSlice';
import {
  useSendMessageMutation,
  useCreateChatSessionMutation,
} from '@/store/api/apiSlice';
import { Message } from '@/types';
import { Sparkles } from 'lucide-react';

const ChatInterface = () => {
  const dispatch = useAppDispatch();
  const {
    messages,
    loading: chatLoading,
    currentSessionId,
    currentSessionTitle,
  } = useAppSelector((state) => state.chat);
  const [sendMessage] = useSendMessageMutation();
  const [createSession] = useCreateChatSessionMutation();
  const [blockedInfo, setBlockedInfo] = useState<{
    show: boolean;
    allowedTopics: string[];
  }>({ show: false, allowedTopics: [] });

  const handleSendMessage = async (content: string) => {
    setBlockedInfo({ show: false, allowedTopics: [] });

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    dispatch(setChatLoading(true));

    try {
      let sessionId = currentSessionId;
      const hasValidSession = sessionId && typeof sessionId === 'string' && sessionId.trim() !== '';

      if (!hasValidSession) {
        const newSession = await createSession().unwrap();
        sessionId = newSession.id;
        dispatch(
          setCurrentSession({
            id: newSession.id,
            title: newSession.title || 'New Chat',
            messages: [userMessage],
          })
        );
      } else {
        dispatch(addMessage(userMessage));
      }

      const response = await sendMessage({ message: content, sessionId: sessionId as string }).unwrap();

      if (response.was_blocked) {
        setBlockedInfo({
          show: true,
          allowedTopics: [],
        });
      } else if (response.assistant_message) {
        const assistantMessage: Message = {
          id: response.assistant_message.id,
          content: response.assistant_message.content,
          role: 'assistant',
          timestamp: response.assistant_message.created_at,
          status: 'sent',
          videoSuggestion: response.video_suggestion,
        };
        dispatch(addMessage(assistantMessage));

        if (response.session_title && response.session_title !== currentSessionTitle) {
          dispatch(setCurrentSessionTitle(response.session_title));
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: 'Something went wrong. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        status: 'error',
      };
      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  const showEmptyState = messages.length === 0 && !chatLoading;

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
            <MessageList messages={messages} />
            {blockedInfo.show && (
              <BlockedNotification allowedTopics={blockedInfo.allowedTopics} />
            )}
            {chatLoading && <LoadingDots />}
          </div>
        )}

        <ChatInput onSend={handleSendMessage} isLoading={chatLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
