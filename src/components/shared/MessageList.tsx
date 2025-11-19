import { useEffect, useRef, useState } from 'react';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import { Bot } from 'lucide-react';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: Message[];
  streamingMessageId?: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, streamingMessageId, scrollContainerRef }: MessageListProps) => {
  const latestUserMessageRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const initialSpacerHeightRef = useRef<number>(0);
  const lastUserMessageIdRef = useRef<string | null>(null);
  const assistantMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Handle User Message
    if (lastMessage.role === 'user') {
      // If this is a new user message we haven't processed for scrolling yet
      if (lastUserMessageIdRef.current !== lastMessage.id) {
        lastUserMessageIdRef.current = lastMessage.id;

        // We need to wait for render to get measurements
        setTimeout(() => {
          if (latestUserMessageRef.current && scrollContainerRef.current) {
            const messageElement = latestUserMessageRef.current;
            const containerElement = scrollContainerRef.current;

            const messageRect = messageElement.getBoundingClientRect();
            const containerRect = containerElement.getBoundingClientRect();
            const containerHeight = containerElement.clientHeight;
            const messageHeight = messageRect.height;

            // Check if message is "short" (fits in viewport with some buffer)
            // We use 80% of container height as threshold for "short"
            const isShortMessage = messageHeight < (containerHeight * 0.8);

            if (isShortMessage) {
              // Calculate how much space we need to add to force message to top
              // We want message at top, so we need enough space below it to fill the container
              // Space needed = Container Height - Message Height
              // We add a tiny bit of extra space (1px) to ensure we can definitely scroll to the very top
              const neededSpacer = Math.max(0, containerHeight - messageHeight + 1);

              setSpacerHeight(neededSpacer);
              initialSpacerHeightRef.current = neededSpacer;

              // Scroll to top of message
              // Current scroll + (message top - container top)
              // We want it flush with the top, so no extra padding subtraction
              const scrollOffset = containerElement.scrollTop + (messageRect.top - containerRect.top);

              containerElement.scrollTo({
                top: scrollOffset,
                behavior: 'smooth'
              });
            } else {
              // Long message: Scroll to show the bottom of the message
              setSpacerHeight(0);
              initialSpacerHeightRef.current = 0;

              // Scroll to bottom of container
              containerElement.scrollTo({
                top: containerElement.scrollHeight,
                behavior: 'smooth'
              });
            }
          }
        }, 50); // Small delay to ensure DOM is updated
      }
    }
    // Handle Assistant Message (Streaming or Complete)
    else if (lastMessage.role === 'assistant') {
      // If we have a spacer, we want to reduce it as the assistant message grows
      if (initialSpacerHeightRef.current > 0) {
        // We don't need to measure assistant message directly,
        // we can just let the natural flow push content down,
        // BUT to keep the user message pinned at top, we need to reduce spacer
        // exactly by the amount the assistant message has grown.

        // Actually, a simpler approach for the "pinned" effect:
        // If we are in "spacer mode", we calculate spacer based on assistant message height
        if (assistantMessageRef.current) {
          const assistantHeight = assistantMessageRef.current.getBoundingClientRect().height;
          const newSpacer = Math.max(0, initialSpacerHeightRef.current - assistantHeight);
          setSpacerHeight(newSpacer);
        }
      } else {
        // Normal auto-scroll for long conversations or when no spacer was needed
        // Only auto-scroll if we are already near bottom to avoid annoying jumps if user scrolled up
        if (scrollContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

          if (isNearBottom) {
            scrollContainerRef.current.scrollTo({
              top: scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      }
    }
  }, [messages, scrollContainerRef, streamingMessageId]);

  // Find the last user message to attach the ref
  const lastUserMessageIndex = messages.length > 0
    ? messages.map(m => m.role).lastIndexOf('user')
    : -1;

  // Find the last assistant message to attach ref
  const lastAssistantMessageIndex = messages.length > 0
    ? messages.map(m => m.role).lastIndexOf('assistant')
    : -1;

  if (messages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIconWrapper}>
          <Bot className={styles.emptyIcon} />
        </div>
        <h2 className={styles.emptyTitle}>Hi there! I'm your AI friend!</h2>
        <p className={styles.emptyDescription}>
          I'm here to help you learn and explore! Ask me anything about science,
          math, history, art, or any other topic you're curious about!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.messagesWrapper}>
      {messages.map((message, index) => (
        <div
          key={message.id}
          ref={
            index === lastUserMessageIndex ? latestUserMessageRef :
              index === lastAssistantMessageIndex ? assistantMessageRef : null
          }
        >
          <ChatMessage
            message={message}
            isStreaming={streamingMessageId === message.id}
          />
        </div>
      ))}
      {/* Dynamic Spacer */}
      <div style={{ height: `${spacerHeight}px`, transition: 'height 0.1s ease-out' }} />
    </div>
  );
};

export default MessageList;
