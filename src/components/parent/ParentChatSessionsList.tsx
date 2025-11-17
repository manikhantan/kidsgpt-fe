import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppSelector } from '@/store/hooks';
import { useGetRecentParentChatSessionsQuery } from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { formatRelativeTime, truncateText } from '@/utils/formatters';
import { ChatSessionSummary } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Button from '@/components/shared/Button';
import { useLoadParentChatSession } from '@/hooks/useLoadParentChatSession';
import { useCreateNewParentChat } from '@/hooks/useCreateNewParentChat';

interface ParentChatSessionsListProps {
  onSessionClick?: () => void;
  maxItems?: number;
}

const ParentChatSessionsList = ({ onSessionClick, maxItems = 20 }: ParentChatSessionsListProps) => {
  const navigate = useNavigate();
  const { currentSessionId } = useAppSelector((state) => state.chat);

  const {
    data: sessions,
    isLoading,
    error,
  } = useGetRecentParentChatSessionsQuery(maxItems);

  const { loadSession } = useLoadParentChatSession({ onSuccess: onSessionClick });
  const { createNewChat, isCurrentConversationEmpty } = useCreateNewParentChat({ onSuccess: onSessionClick });

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSessionClick = async (session: ChatSessionSummary) => {
    await loadSession(session);
  };

  const handleViewAllChats = () => {
    navigate(ROUTES.PARENT_ALL_CHATS);
    onSessionClick?.();
  };

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 px-4 text-xs text-red-500 bg-red-50 rounded-lg mx-4">
        Failed to load chat sessions
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100">
        <Button
          variant="primary"
          size="md"
          className="w-full shadow-soft-lg"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleNewChat}
          disabled={isCurrentConversationEmpty}
          title={isCurrentConversationEmpty ? 'Send a message first to start a new chat' : undefined}
        >
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <div className="px-4 mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Recent Chats
          </span>
        </div>

        {(!sessions || sessions.length === 0) ? (
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">No chat history yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a new conversation!</p>
          </div>
        ) : (
          <div className="space-y-1 px-3">
            {sessions.map((session, index) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={clsx(
                  'w-full text-left px-3 py-3 rounded-xl transition-all duration-200 group animate-slide-in-right',
                  currentSessionId === session.id
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-soft border border-primary-100/50'
                    : 'hover:bg-gray-50 text-gray-700 hover:shadow-soft border border-transparent'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'p-2 rounded-lg transition-colors',
                    currentSessionId === session.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  )}>
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {truncateText(session.title, 30)}
                    </div>
                    {session.preview && (
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {truncateText(session.preview, 40)}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1 font-medium">
                      {formatRelativeTime(session.lastMessageAt)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {sessions && sessions.length > 0 && (
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleViewAllChats}
            className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-semibold py-2.5 hover:bg-primary-50 rounded-xl transition-all duration-200 border border-transparent hover:border-primary-100"
          >
            View All Chats
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentChatSessionsList;
