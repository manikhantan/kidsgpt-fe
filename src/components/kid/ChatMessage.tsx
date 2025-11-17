import { Message } from '@/types';
import { formatMessageTime } from '@/utils/formatters';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-600'
            : 'bg-gradient-to-br from-gray-100 to-gray-200'
        }`}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-gray-600" />
        )}
      </div>

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-5 py-3 shadow-soft ${
            isUser
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-tr-md'
              : 'bg-white text-gray-900 border border-gray-100 rounded-tl-md'
          }`}
        >
          <p className="text-base break-words whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-400 mt-1.5 px-1 font-medium">
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
