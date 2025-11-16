import { useState, useEffect } from 'react';
import { LogOut, Shield } from 'lucide-react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import BlockedNotification from './BlockedNotification';
import Button from '@/components/shared/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, setChatLoading } from '@/store/slices/chatSlice';
import { useSendMessageMutation, useGetKidChatHistoryQuery } from '@/store/api/apiSlice';
import { Message } from '@/types';
import { APP_NAME } from '@/utils/constants';

const ChatInterface = () => {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const { messages, loading: chatLoading } = useAppSelector((state) => state.chat);
  const [sendMessage] = useSendMessageMutation();
  const [blockedInfo, setBlockedInfo] = useState<{
    show: boolean;
    allowedTopics: string[];
  }>({ show: false, allowedTopics: [] });

  const { data: chatHistory, isLoading: loadingHistory } = useGetKidChatHistoryQuery();

  useEffect(() => {
    if (chatHistory?.sessions && chatHistory.sessions.length > 0) {
      const lastSession = chatHistory.sessions[chatHistory.sessions.length - 1];
      lastSession.messages.forEach((msg) => {
        dispatch(addMessage(msg));
      });
    }
  }, [chatHistory, dispatch]);

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
      const response = await sendMessage(content).unwrap();

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

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <LoadingSpinner size="lg" text="Loading your chats..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, <span className="font-medium text-primary-600">{user?.name}</span>!
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} />

        {blockedInfo.show && (
          <BlockedNotification allowedTopics={blockedInfo.allowedTopics} />
        )}

        {chatLoading && (
          <div className="flex justify-start px-4 pb-2">
            <div className="bg-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
