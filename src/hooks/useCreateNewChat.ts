import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentSession } from '@/store/slices/chatSlice';
import { ROUTES } from '@/utils/constants';

interface UseCreateNewChatOptions {
  onSuccess?: () => void;
}

export const useCreateNewChat = (options: UseCreateNewChatOptions = {}) => {
  const { onSuccess } = options;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { messages } = useAppSelector((state) => state.chat);

  // Check if current conversation is empty (no messages sent yet)
  const isCurrentConversationEmpty = messages.length === 0;

  const createNewChat = () => {
    // Don't create a new session if current conversation is already empty
    if (isCurrentConversationEmpty) {
      // Just navigate to chat page, no need to create a new session
      navigate(ROUTES.KID_CHAT);
      onSuccess?.();
      return;
    }

    // Clear the current session - a new backend session will be created when user sends first message
    dispatch(
      setCurrentSession({
        id: null,
        title: null,
        messages: [],
      })
    );
    navigate(ROUTES.KID_CHAT);
    onSuccess?.();
  };

  return { createNewChat, isCurrentConversationEmpty };
};
