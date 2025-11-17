import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
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

  // Sessions are selected explicitly from the sidebar via setCurrentSession
  // This ensures the correct session ID is always used

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
      // If no session exists, create one first
      let sessionId = currentSessionId;
      // Validate sessionId is a non-empty string
      const hasValidSession = sessionId && typeof sessionId === 'string' && sessionId.trim() !== '';

      if (!hasValidSession) {
        const newSession = await createSession().unwrap();
        sessionId = newSession.id;
        // Use setCurrentSession to atomically update session and clear old messages
        dispatch(
          setCurrentSession({
            id: newSession.id,
            title: newSession.title || 'New Chat',
            messages: [userMessage], // Start fresh with just the user message
          })
        );
      } else {
        // Add message to existing session
        dispatch(addMessage(userMessage));
      }

      const response = await sendMessage({ message: content, sessionId: sessionId as string }).unwrap();

      if (response.blocked) {
        setBlockedInfo({
          show: true,
          allowedTopics: response.allowedTopics || [],
        });
      } else {
        const assistantMessage: Message = {
          id: response.id || `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: response.response,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          status: 'sent',
        };
        dispatch(addMessage(assistantMessage));

        // Update session title if returned
        if (response.sessionTitle && response.sessionTitle !== currentSessionTitle) {
          dispatch(setCurrentSessionTitle(response.sessionTitle));
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
