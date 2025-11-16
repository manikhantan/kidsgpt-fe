import { useState } from 'react';
import MessageList from '@/components/kid/MessageList';
import ChatInput from '@/components/kid/ChatInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, setChatLoading } from '@/store/slices/chatSlice';
import { useSendParentMessageMutation } from '@/store/api/apiSlice';
import { Message } from '@/types';

const ParentChatInterface = () => {
  const dispatch = useAppDispatch();
  const { messages, loading: chatLoading } = useAppSelector((state) => state.chat);
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
      const response = await sendMessage(content).unwrap();

      const assistantMessage: Message = {
        id: response.id,
        content: response.response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      dispatch(addMessage(assistantMessage));
    } catch (err) {
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
    <div className="flex flex-col flex-1 bg-gray-50">
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} />

        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
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

export default ParentChatInterface;
