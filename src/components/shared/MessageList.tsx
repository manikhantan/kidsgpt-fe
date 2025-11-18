import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  streamingMessageId?: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, streamingMessageId, scrollContainerRef }: MessageListProps) => {
  const latestUserMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // If the last message is from the user, scroll to position it at the top
    if (lastMessage.role === 'user' && latestUserMessageRef.current && scrollContainerRef.current) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        if (latestUserMessageRef.current && scrollContainerRef.current) {
          // Get the bounding rectangles
          const containerRect = scrollContainerRef.current.getBoundingClientRect();
          const messageRect = latestUserMessageRef.current.getBoundingClientRect();

          // Calculate how much we need to scroll
          const scrollOffset = messageRect.top - containerRect.top;

          // Add the current scroll position to get the final scroll position
          const finalScrollTop = scrollContainerRef.current.scrollTop + scrollOffset;

          // Set the scroll position directly
          scrollContainerRef.current.scrollTop = finalScrollTop;
        }
      }, 50);
    }
  }, [messages, scrollContainerRef]);

  // Find the last user message to attach the ref
  const lastUserMessageIndex = messages.length > 0 && messages[messages.length - 1].role === 'user'
    ? messages.length - 1
    : -1;

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
        messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === lastUserMessageIndex ? latestUserMessageRef : null}
          >
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
