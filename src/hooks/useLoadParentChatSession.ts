import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentSession } from '@/store/slices/chatSlice';
import { useLazyGetParentChatSessionQuery } from '@/store/api/apiSlice';
import { ChatSessionSummary } from '@/types';
import { ROUTES } from '@/utils/constants';

interface UseLoadParentChatSessionOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  navigateOnSuccess?: boolean;
}

export const useLoadParentChatSession = (options: UseLoadParentChatSessionOptions = {}) => {
  const { onSuccess, onError, navigateOnSuccess = true } = options;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [getSession, { isLoading }] = useLazyGetParentChatSessionQuery();

  const loadSession = async (session: ChatSessionSummary) => {
    try {
      const fullSession = await getSession(session.id).unwrap();
      dispatch(
        setCurrentSession({
          id: fullSession.id,
          title: fullSession.title || session.title,
          messages: fullSession.messages,
        })
      );
      if (navigateOnSuccess) {
        navigate(ROUTES.PARENT_CHAT);
      }
      onSuccess?.();
    } catch (err) {
      console.error('Failed to load session:', err);
      onError?.(err);
    }
  };

  return { loadSession, isLoading };
};
