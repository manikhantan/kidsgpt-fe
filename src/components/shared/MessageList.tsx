import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  streamingMessageId?: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, streamingMessageId, scrollContainerRef }: MessageListProps) => {
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (messages.length === 0 || !scrollContainerRef.current) return;

    const lastMessage = messages[messages.length - 1];

    // If the last message is from the user, scroll to position it at the top
    if (lastMessage.role === 'user') {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        const messageElement = messageRefs.current.get(lastMessage.id);
        if (messageElement && scrollContainerRef.current) {
          // Calculate the scroll position to place the message at the top
          const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
          const messageTop = messageElement.getBoundingClientRect().top;
          const scrollOffset = messageTop - containerTop;

          scrollContainerRef.current.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [messages, scrollContainerRef]);

  const setMessageRef = (id: string, element: HTMLDivElement | null) => {
    if (element) {
      messageRefs.current.set(id, element);
    } else {
      messageRefs.current.delete(id);
    }
  };

  return (
    <div className="w-full">
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
          <div key={message.id} ref={(el) => setMessageRef(message.id, el)}>
            <ChatMessage
              message={message}
              isStreaming={streamingMessageId === message.id}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
