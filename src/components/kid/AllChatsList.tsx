import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Plus, Calendar, MessageCircle } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentSession } from '@/store/slices/chatSlice';
import {
  useGetChatSessionsQuery,
  useCreateChatSessionMutation,
  useLazyGetChatSessionQuery,
} from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { formatRelativeTime, formatDate, truncateText } from '@/utils/formatters';
import { ChatSessionSummary } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';

const AllChatsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
  } = useGetChatSessionsQuery({ page, pageSize: 15 });

  const [createSession, { isLoading: isCreating }] = useCreateChatSessionMutation();
  const [getSession] = useLazyGetChatSessionQuery();

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

  const handleNewChat = async () => {
    try {
      const newSession = await createSession().unwrap();
      dispatch(
        setCurrentSession({
          id: newSession.id,
          title: newSession.title || 'New Chat',
          messages: [],
        })
      );
      navigate(ROUTES.KID_CHAT);
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
  };

  const handleSessionClick = async (session: ChatSessionSummary) => {
    try {
      const fullSession = await getSession(session.id).unwrap();
      dispatch(
        setCurrentSession({
          id: fullSession.id,
          title: fullSession.title || session.title,
          messages: fullSession.messages,
        })
      );
      navigate(ROUTES.KID_CHAT);
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.KID_CHAT);
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-yellow-50 to-orange-50">
        <LoadingSpinner size="lg" text="Loading your chats..." />
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
        <ErrorMessage
          message="Oops! We couldn't load your chats. Please try again!"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">All Chats</h1>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleNewChat}
          isLoading={isCreating}
        >
          New Chat
        </Button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-4">
        {allSessions.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-500 mb-4">Start a new conversation to see it here!</p>
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleNewChat}
              isLoading={isCreating}
            >
              Start New Chat
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {allSessions.map((session) => (
              <Card
                key={session.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {session.title}
                    </h3>
                    {session.preview && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {truncateText(session.preview, 100)}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(session.startedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {session.messageCount} messages
                      </span>
                      <span>{formatRelativeTime(session.lastMessageAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Loading indicator for infinite scroll */}
            <div ref={loadingRef} className="py-4 text-center">
              {isFetching && hasMore && (
                <LoadingSpinner size="sm" text="Loading more chats..." />
              )}
              {!hasMore && allSessions.length > 0 && (
                <p className="text-sm text-gray-500">You've reached the end!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllChatsList;
