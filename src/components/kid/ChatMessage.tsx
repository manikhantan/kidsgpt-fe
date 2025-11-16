import { Message } from '@/types';
import { formatMessageTime } from '@/utils/formatters';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="text-base break-words whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">
        {formatMessageTime(message.timestamp)}
      </span>
    </div>
  );
};

export default ChatMessage;
