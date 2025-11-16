import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const scrollRef = useAutoScroll<HTMLDivElement>([messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <span className="text-4xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hi there! I'm your AI friend!
          </h2>
          <p className="text-gray-600 max-w-md">
            I'm here to help you learn and explore! Ask me anything about science,
            math, history, art, or any other topic you're curious about!
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
    </div>
  );
};

export default MessageList;
