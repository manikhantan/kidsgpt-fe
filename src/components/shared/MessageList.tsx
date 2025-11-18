import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface MessageListProps {
  messages: Message[];
  streamingMessageId?: string | null;
}

const MessageList = ({ messages, streamingMessageId }: MessageListProps) => {
  const scrollRef = useAutoScroll<HTMLDivElement>([messages]);

  return (
    <div
      ref={scrollRef}
      className="w-full"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <div className="w-16 h-16 bg-surface-secondary rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <span className="text-4xl">👋</span>
          </div>
          <h2 className="text-3xl font-semibold text-text-primary mb-3 tracking-tight">
            Hi there! I'm your AI friend!
          </h2>
          <p className="text-base text-text-secondary max-w-lg px-6 leading-relaxed">
            I'm here to help you learn and explore! Ask me anything about science,
            math, history, art, or any other topic you're curious about!
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={streamingMessageId === message.id}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;
