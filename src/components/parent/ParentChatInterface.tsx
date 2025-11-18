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
    <div className="flex flex-col h-full">
      {/* Session title header */}
      {currentSessionTitle && (
        <div className="bg-surface border-b border-border px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary truncate tracking-tight">
              {currentSessionTitle}
            </h2>
          </div>
        </div>
      )}

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
