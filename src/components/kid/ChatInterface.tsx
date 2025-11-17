import { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import BlockedNotification from './BlockedNotification';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addMessage,
  setChatLoading,
  setCurrentSessionId,
  setCurrentSessionTitle,
} from '@/store/slices/chatSlice';
import {
  useSendMessageMutation,
  useGetKidChatHistoryQuery,
  useCreateChatSessionMutation,
} from '@/store/api/apiSlice';
import { Message } from '@/types';
import { Bot, MessageCircle } from 'lucide-react';

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
  const hasLoadedHistory = useRef(false);

  const {
    data: chatHistory,
    isLoading: loadingHistory,
    error: historyError,
    refetch,
  } = useGetKidChatHistoryQuery(undefined, {
    skip: !!currentSessionId, // Skip if we already have a session
  });

  // Load last session if no current session is set
  useEffect(() => {
    if (!currentSessionId && chatHistory?.sessions && chatHistory.sessions.length > 0 && !hasLoadedHistory.current) {
      hasLoadedHistory.current = true;
      const lastSession = chatHistory.sessions[chatHistory.sessions.length - 1];
      dispatch(setCurrentSessionId(lastSession.id));
      dispatch(setCurrentSessionTitle(lastSession.title || 'Chat'));
      lastSession.messages.forEach((msg) => {
        dispatch(addMessage(msg));
      });
    }
  }, [chatHistory, currentSessionId, dispatch]);

  const handleSendMessage = async (content: string) => {
    setBlockedInfo({ show: false, allowedTopics: [] });

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    dispatch(addMessage(userMessage));
    dispatch(setChatLoading(true));

    try {
      // If no session exists, create one first
      let sessionId = currentSessionId;
      if (!sessionId) {
        const newSession = await createSession().unwrap();
        sessionId = newSession.id;
        dispatch(setCurrentSessionId(newSession.id));
        dispatch(setCurrentSessionTitle(newSession.title || 'New Chat'));
      }

      const response = await sendMessage({ message: content, sessionId: sessionId || undefined }).unwrap();

      if (response.blocked) {
        setBlockedInfo({
          show: true,
          allowedTopics: response.allowedTopics || [],
        });
      } else {
        const assistantMessage: Message = {
          id: response.id,
          content: response.response,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          status: 'sent',
        };
        dispatch(addMessage(assistantMessage));

        // Update session title if returned
        if (response.sessionTitle) {
          dispatch(setCurrentSessionTitle(response.sessionTitle));
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: 'Oops! Something went wrong. Please try again!',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        status: 'error',
      };
      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  if (loadingHistory && !currentSessionId) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center animate-fade-in">
          <LoadingSpinner size="lg" text="Loading your chats..." />
        </div>
      </div>
    );
  }

  if (historyError && !currentSessionId) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
        <ErrorMessage
          message="Oops! We couldn't load your chats. Please try again!"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-soft">
      {/* Session title header */}
      {currentSessionTitle && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary-500" />
            <h2 className="text-sm font-semibold text-gray-700 truncate">
              {currentSessionTitle}
            </h2>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} />

        {blockedInfo.show && (
          <BlockedNotification allowedTopics={blockedInfo.allowedTopics} />
        )}

        {chatLoading && (
          <div className="flex justify-start px-6 pb-3">
            <div className="flex items-center gap-3 animate-slide-up">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-gray-600" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3.5 shadow-soft border border-gray-100">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <ChatInput onSend={handleSendMessage} isLoading={chatLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
