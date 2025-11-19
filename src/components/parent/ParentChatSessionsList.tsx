import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppSelector } from '@/store/hooks';
import { useGetRecentParentChatSessionsQuery } from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { truncateText } from '@/utils/formatters';
import { ChatSessionSummary } from '@/types';
import { useLoadParentChatSession } from '@/hooks/useLoadParentChatSession';
import { useCreateNewParentChat } from '@/hooks/useCreateNewParentChat';
import styles from './ParentChatSessionsList.module.css';

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

  const handleGoHome = () => {
    navigate(ROUTES.PARENT_DASHBOARD);
    onSessionClick?.();
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDots}>
          <div className={styles.dot} />
          <div className={styles.dot} style={{ animationDelay: '150ms' }} />
          <div className={styles.dot} style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-xs text-red-400 bg-red-400/10 rounded-lg p-3">
          Failed to load chat sessions
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Action Buttons */}
      <div className={styles.actionSection}>
        <button
          onClick={handleGoHome}
          className={styles.actionButton}
        >
          <Home className={styles.sessionIcon} />
          <span>Back to Dashboard</span>
        </button>
        <div className={styles.divider} />
        <button
          onClick={handleNewChat}
          disabled={isCurrentConversationEmpty}
          className={styles.actionButton}
          title={isCurrentConversationEmpty ? 'Send a message first to start a new chat' : undefined}
        >
          <Plus className={styles.sessionIcon} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className={styles.listSection}>
        {sessions && sessions.length > 0 && (
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>
              Recent
            </span>
          </div>
        )}

        {(!sessions || sessions.length === 0) ? (
          <div className={styles.emptyState}>
            <MessageSquare className={styles.emptyIcon} />
            <p className={styles.emptyText}>No chat history</p>
            <p className={styles.emptySubtext}>
              Start a conversation
            </p>
          </div>
        ) : (
          <div className={styles.sessionList}>
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={clsx(
                  styles.sessionItem,
                  currentSessionId === session.id && styles.sessionItemActive
                )}
              >
                <MessageSquare className={styles.sessionIcon} />
                <span className={styles.sessionTitle}>
                  {truncateText(session.title, 28)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View All Button */}
      {sessions && sessions.length > 0 && (
        <div className={styles.footer}>
          <button
            onClick={handleViewAllChats}
            className={styles.viewAllButton}
          >
            View all chats
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentChatSessionsList;
