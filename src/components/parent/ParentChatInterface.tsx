import { MessageSquare } from 'lucide-react';
import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import { useAppSelector } from '@/store/hooks';
import { useStreamingChat } from '@/hooks/useStreamingChat';

const ParentChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingMessageId,
    currentSessionId,
    currentSessionTitle,
  } = useAppSelector((state) => state.chat);
  const { sendStreamingMessage } = useStreamingChat('parent');

  const handleSendMessage = async (content: string) => {
    // Use streaming chat
    await sendStreamingMessage(content, currentSessionId, {
      onError: (error) => {
        console.error('Streaming error:', error);
      },
    });
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
        <MessageList messages={messages} streamingMessageId={streamingMessageId} />

        <ChatInput onSend={handleSendMessage} isLoading={isStreaming} />
      </div>
    </div>
  );
};

export default ParentChatInterface;
