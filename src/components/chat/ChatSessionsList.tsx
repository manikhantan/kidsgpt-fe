import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useGetRecentChatSessionsQuery } from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { truncateText } from '@/utils/formatters';
import { ChatSessionSummary } from '@/types';
import { useLoadChatSession } from '@/hooks/useLoadChatSession';
import { clsx } from 'clsx';
import styles from './ChatSessionsList.module.css';

interface ChatSessionsListProps {
  onSessionClick?: () => void;
  maxItems?: number;
}

const ChatSessionsList = ({ onSessionClick, maxItems = 20 }: ChatSessionsListProps) => {
  const navigate = useNavigate();
  const { currentSessionId } = useAppSelector((state) => state.chat);

  const {
    data: sessions,
    isLoading,
    error,
  } = useGetRecentChatSessionsQuery(maxItems);

  const { loadSession } = useLoadChatSession({ onSuccess: onSessionClick });

  const handleSessionClick = async (session: ChatSessionSummary) => {
    await loadSession(session);
  };

  const handleViewAllChats = () => {
    navigate(ROUTES.KID_ALL_CHATS);
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
      <div className={styles.error}>
        <div className={styles.errorMessage}>
          Failed to load chat sessions
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sessions List */}
      <div className={styles.list}>
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
          <div className={styles.items}>
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={clsx(
                  styles.item,
                  currentSessionId === session.id && styles.itemActive
                )}
              >
                <MessageSquare className={styles.itemIcon} />
                <span className={styles.itemTitle}>
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

export default ChatSessionsList;
