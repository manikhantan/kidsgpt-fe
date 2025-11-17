import { useNavigate } from 'react-router-dom';
import { useGetRecentParentChatSessionsQuery } from '@/store/api/apiSlice';
import { ROUTES } from '@/utils/constants';
import { ChatSessionSummary } from '@/types';
import ChatSessionsList from '@/components/chat/ChatSessionsList';
import { useLoadParentChatSession } from '@/hooks/useLoadParentChatSession';
import { useCreateNewParentChat } from '@/hooks/useCreateNewParentChat';

interface ParentChatSessionsListProps {
  onSessionClick?: () => void;
  maxItems?: number;
}

const ParentChatSessionsList = ({ onSessionClick, maxItems = 20 }: ParentChatSessionsListProps) => {
  const navigate = useNavigate();

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

  return (
    <ChatSessionsList
      onSessionClick={onSessionClick}
      maxItems={maxItems}
      sessions={sessions}
      isLoading={isLoading}
      error={error}
      onNewChat={handleNewChat}
      isNewChatDisabled={isCurrentConversationEmpty}
      onLoadSession={handleSessionClick}
      onViewAllChats={handleViewAllChats}
      showBackButton={true}
      onBackClick={handleGoHome}
    />
  );
};

export default ParentChatSessionsList;
