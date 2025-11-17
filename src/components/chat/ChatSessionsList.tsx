import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentSession } from '@/store/slices/chatSlice';
import {
  useGetRecentChatSessionsQuery,
  useCreateChatSessionMutation,
  useLazyGetChatSessionQuery,
} from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { formatRelativeTime, truncateText } from '@/utils/formatters';
import { ChatSessionSummary } from '@/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Button from '@/components/shared/Button';

interface ChatSessionsListProps {
  onSessionClick?: () => void;
  maxItems?: number;
}

const ChatSessionsList = ({ onSessionClick, maxItems = 20 }: ChatSessionsListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentSessionId } = useAppSelector((state) => state.chat);

  const {
    data: sessions,
    isLoading,
    error,
  } = useGetRecentChatSessionsQuery(maxItems);

  const [createSession, { isLoading: isCreating }] = useCreateChatSessionMutation();
  const [getSession] = useLazyGetChatSessionQuery();

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
      onSessionClick?.();
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
      onSessionClick?.();
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  const handleViewAllChats = () => {
    navigate(ROUTES.KID_ALL_CHATS);
    onSessionClick?.();
  };

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 px-3 text-xs text-red-500">
        Failed to load chat sessions
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-200">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleNewChat}
          isLoading={isCreating}
        >
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent Chats
          </span>
        </div>

        {(!sessions || sessions.length === 0) ? (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            No chat history yet
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-lg transition-colors group',
                  currentSessionId === session.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {truncateText(session.title, 30)}
                    </div>
                    {session.preview && (
                      <div className="text-xs text-gray-500 truncate">
                        {truncateText(session.preview, 40)}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">
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
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleViewAllChats}
            className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 hover:bg-primary-50 rounded-lg transition-colors"
          >
            View All Chats
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSessionsList;
