import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppSelector } from '@/store/hooks';
import { useGetRecentChatSessionsQuery } from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { truncateText } from '@/utils/formatters';
import { ChatSessionSummary } from '@/types';
import { useLoadChatSession } from '@/hooks/useLoadChatSession';

interface ChatSessionsListProps {
  onSessionClick?: () => void;
  maxItems?: number;
  // Optional overrides for parent chat functionality
  sessions?: ChatSessionSummary[];
  isLoading?: boolean;
  error?: unknown;
  onNewChat?: () => void;
  isNewChatDisabled?: boolean;
  onLoadSession?: (session: ChatSessionSummary) => Promise<void>;
  onViewAllChats?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const ChatSessionsList = ({
  onSessionClick,
  maxItems = 20,
  sessions: externalSessions,
  isLoading: externalIsLoading,
  error: externalError,
  onNewChat: externalOnNewChat,
  isNewChatDisabled: externalIsNewChatDisabled,
  onLoadSession: externalOnLoadSession,
  onViewAllChats: externalOnViewAllChats,
  showBackButton = false,
  onBackClick,
}: ChatSessionsListProps) => {
  const navigate = useNavigate();
  const { currentSessionId } = useAppSelector((state) => state.chat);

  const {
    data: internalSessions,
    isLoading: internalIsLoading,
    error: internalError,
  } = useGetRecentChatSessionsQuery(maxItems, { skip: !!externalSessions });

  const { loadSession } = useLoadChatSession({ onSuccess: onSessionClick });

  const handleSessionClick = async (session: ChatSessionSummary) => {
    if (externalOnLoadSession) {
      await externalOnLoadSession(session);
    } else {
      await internalLoadSession(session);
    }
  };

  const handleViewAllChats = () => {
    if (externalOnViewAllChats) {
      externalOnViewAllChats();
    } else {
      navigate(ROUTES.KID_ALL_CHATS);
      onSessionClick?.();
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-sidebar-text-muted rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-sidebar-text-muted rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-sidebar-text-muted rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 px-3">
        <div className="text-xs text-error bg-error/10 rounded-lg p-3">
          Failed to load chat sessions
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {sessions && sessions.length > 0 && (
          <div className="mb-2 px-3">
            <span className="text-xs font-medium text-sidebar-text-muted uppercase tracking-wider">
              Recent
            </span>
          </div>
        )}

        {(!sessions || sessions.length === 0) ? (
          <div className="px-3 py-8 text-center">
            <MessageSquare className="h-8 w-8 text-sidebar-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm text-sidebar-text-muted">No chat history</p>
            <p className="text-xs text-sidebar-text-muted mt-1 opacity-75">
              Start a conversation
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={clsx(
                  'w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150 group relative',
                  currentSessionId === session.id
                    ? 'bg-sidebar-hover'
                    : 'hover:bg-sidebar-hover'
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-sidebar-text-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-sidebar-text truncate">
                      {truncateText(session.title, 28)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View All Button */}
      {sessions && sessions.length > 0 && (
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={handleViewAllChats}
            className="w-full text-center text-xs text-sidebar-text-muted hover:text-sidebar-text py-2 rounded-lg hover:bg-sidebar-hover transition-colors"
          >
            View all chats
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSessionsList;
