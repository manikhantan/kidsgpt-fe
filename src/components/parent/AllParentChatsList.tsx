import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Plus, Calendar, MessageCircle } from 'lucide-react';
import { useGetParentChatSessionsQuery } from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { formatRelativeTime, formatDate, truncateText } from '@/utils/formatters';
import { ChatSessionSummary } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import Button from '@/components/shared/Button';
import { useLoadParentChatSession } from '@/hooks/useLoadParentChatSession';
import { useCreateNewParentChat } from '@/hooks/useCreateNewParentChat';
import styles from './AllParentChatsList.module.css';

const AllParentChatsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [allSessions, setAllSessions] = useState<ChatSessionSummary[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);

  const {
    data: paginatedData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetParentChatSessionsQuery({ page, pageSize: 15 });

  const { loadSession } = useLoadParentChatSession();
  const { createNewChat, isCurrentConversationEmpty } = useCreateNewParentChat();

  // Update sessions when new data comes in
  useEffect(() => {
    if (paginatedData) {
      if (page === 1) {
        setAllSessions(paginatedData.sessions);
      } else {
        setAllSessions((prev) => [...prev, ...paginatedData.sessions]);
      }
      setHasMore(paginatedData.hasMore);
    }
  }, [paginatedData, page]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isFetching]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSessionClick = async (session: ChatSessionSummary) => {
    await loadSession(session);
  };

  const handleBack = () => {
    navigate(ROUTES.PARENT_CHAT);
  };

  if (isLoading && page === 1) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="lg" text="Loading your chats..." />
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage
          message="Unable to load chat history. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className={styles.title}>All Chats</h1>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={handleNewChat}
          disabled={isCurrentConversationEmpty}
          title={isCurrentConversationEmpty ? 'Send a message first to start a new chat' : undefined}
        >
          New Chat
        </Button>
      </div>

      {/* Chat list */}
      <div className={styles.list}>
        {allSessions.length === 0 ? (
          <div className={styles.emptyCard}>
            <MessageSquare className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No chats yet</h3>
            <p className={styles.emptyText}>Start a new conversation to see it here!</p>
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={handleNewChat}
              disabled={isCurrentConversationEmpty}
              title={isCurrentConversationEmpty ? 'Send a message first to start a new chat' : undefined}
            >
              Start New Chat
            </Button>
          </div>
        ) : (
          <div className={styles.sessionsGrid}>
            {allSessions.map((session) => (
              <div
                key={session.id}
                className={styles.sessionCard}
                onClick={() => handleSessionClick(session)}
              >
                <div className={styles.sessionContent}>
                  <div className={styles.sessionIconWrapper}>
                    <MessageCircle className={styles.sessionIcon} />
                  </div>
                  <div className={styles.sessionDetails}>
                    <h3 className={styles.sessionTitle}>
                      {session.title}
                    </h3>
                    {session.preview && (
                      <p className={styles.sessionPreview}>
                        {truncateText(session.preview, 100)}
                      </p>
                    )}
                    <div className={styles.sessionMeta}>
                      <span className={styles.metaItem}>
                        <Calendar className={styles.metaIcon} />
                        {formatDate(session.startedAt)}
                      </span>
                      <span className={styles.metaItem}>
                        <MessageSquare className={styles.metaIcon} />
                        {session.messageCount} messages
                      </span>
                      <span>{formatRelativeTime(session.lastMessageAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator for infinite scroll */}
            <div ref={loadingRef} className={styles.loadingMore}>
              {isFetching && hasMore && (
                <LoadingSpinner size="sm" text="Loading more chats..." />
              )}
              {!hasMore && allSessions.length > 0 && (
                <p className={styles.endMessage}>You've reached the end!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllParentChatsList;
