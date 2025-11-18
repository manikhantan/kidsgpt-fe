import MessageList from '@/components/shared/MessageList';
import ChatInput from '@/components/shared/ChatInput';
import { useAppSelector } from '@/store/hooks';
import { useStreamingChat } from '@/hooks/useStreamingChat';

const ParentChatInterface = () => {
  const {
    messages,
    isStreaming,
    streamingMessageId,
  } = useAppSelector((state) => state.chat);
  const { sendStreamingMessage } = useStreamingChat('parent');

  const handleSendMessage = async (content: string) => {
    // Use streaming chat
    await sendStreamingMessage(content, {
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
