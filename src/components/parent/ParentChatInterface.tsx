import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import LoadingDots from '@/components/shared/LoadingDots';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, setChatLoading, setCurrentSessionId, setCurrentSessionTitle } from '@/store/slices/chatSlice';
import { useSendParentMessageMutation } from '@/store/api/apiSlice';
import { Message } from '@/types';

const ParentChatInterface = () => {
  const dispatch = useAppDispatch();
  const { messages, loading: chatLoading, currentSessionId, currentSessionTitle } = useAppSelector((state) => state.chat);
  const [sendMessage] = useSendParentMessageMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    setError(null);

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
      const response = await sendMessage({ message: content, sessionId: currentSessionId || undefined }).unwrap();
      console.log('Parent chat API response:', response);

      // Update session info if this is a new session
      if (response.session_id && !currentSessionId) {
        dispatch(setCurrentSessionId(response.session_id));
        dispatch(setCurrentSessionTitle(response.session_title || 'New Chat'));
      } else if (response.session_title && response.session_title !== currentSessionTitle) {
        // Update title if it changed (e.g., generated from first message)
        dispatch(setCurrentSessionTitle(response.session_title));
      }

      const assistantMessage: Message = {
        id: response.assistant_message.id,
        content: response.assistant_message.content,
        role: 'assistant',
        timestamp: response.assistant_message.created_at,
        status: 'sent',
        videoSuggestion: response.video_suggestion,
      };
      console.log('Adding assistant message:', assistantMessage);
      dispatch(addMessage(assistantMessage));
    } catch (err) {
      console.error('Parent chat error:', err);
      setError('Failed to send message. Please try again.');
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
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

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Session title header */}
      {currentSessionTitle && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {currentSessionTitle}
            </h2>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} />

        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {chatLoading && <LoadingDots variant="simple" />}

        <ChatInput onSend={handleSendMessage} isLoading={chatLoading} />
      </div>
    </div>
  );
};

export default ParentChatInterface;
