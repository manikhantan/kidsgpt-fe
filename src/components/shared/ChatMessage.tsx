import { Message } from '@/types';
import { formatMessageTime } from '@/utils/formatters';
import { Bot, User, AlertTriangle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  compact?: boolean;
}

const ChatMessage = ({ message, compact = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const isBlocked = message.blocked;

  if (compact) {
    // Compact variant for history viewer
    return (
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
            isBlocked
              ? 'bg-orange-100 text-orange-800 border border-orange-300'
              : isUser
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          {isBlocked && (
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Blocked Content</span>
            </div>
          )}
          <p className="break-words">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isBlocked
            ? 'bg-gradient-to-br from-orange-100 to-orange-200'
            : isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-600'
            : 'bg-gradient-to-br from-gray-100 to-gray-200'
        }`}
      >
        {isBlocked ? (
          <AlertTriangle className="h-5 w-5 text-orange-600" />
        ) : isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-gray-600" />
        )}
      </div>

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-5 py-3 shadow-soft ${
            isBlocked
              ? 'bg-orange-100 text-orange-800 border border-orange-300 rounded-tr-md'
              : isUser
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-tr-md'
              : 'bg-white text-gray-900 border border-gray-100 rounded-tl-md'
          }`}
        >
          {isBlocked && (
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Blocked Content</span>
            </div>
          )}
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
