import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addMessage,
  updateMessage,
  appendToMessage,
  startStreaming,
  stopStreaming,
  setCurrentSessionId,
  setCurrentSessionTitle,
} from '@/store/slices/chatSlice';
import { apiSlice } from '@/store/api/apiSlice';
import { createStreamingChat } from '@/services/streamingChat';
import { Message } from '@/types';
import type { StreamingChatRequest } from '@/types/streaming';

/**
 * Custom hook for managing streaming chat connections
 */
export function useStreamingChat(userRole: 'kid' | 'parent' = 'kid') {
  const dispatch = useAppDispatch();
  const currentSessionId = useAppSelector((state) => state.chat.currentSessionId);
  const cleanupRef = useRef<(() => void) | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const messageCreatedRef = useRef<boolean>(false);

  /**
   * Send a message and establish streaming connection
   */
  const sendStreamingMessage = useCallback(
    async (
      content: string,
      callbacks?: {
        onBlocked?: () => void;
        onError?: (error: string) => void;
      }
    ) => {
      // Create optimistic user message
      const userMessageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userMessage: Message = {
        id: userMessageId,
        content,
        role: 'user',
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      // Add user message to state immediately
      dispatch(addMessage(userMessage));

      // Prepare streaming request
      const request: StreamingChatRequest = {
        message: content,
      };

      // Include session_id if we have one
      if (currentSessionId) {
        request.sessionId = currentSessionId;
      }

      // Create placeholder for assistant message
      const assistantMessageId = `msg-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`;
      streamingMessageIdRef.current = assistantMessageId;
      messageCreatedRef.current = false;

      // Start streaming connection
      try {
        const cleanup = await createStreamingChat(request, {
          onUserMessage: (data) => {
            // Update user message with real ID from backend
            dispatch(
              updateMessage({
                id: userMessageId,
                updates: {
                  id: data.id,
                },
              })
            );

            // Always update session ID from backend response
            // Backend is the source of truth for session management
            if (data.session_id) {
              dispatch(setCurrentSessionId(data.session_id));
            }
          },

          onChunk: (data) => {
            // If this is the first chunk, create the assistant message
            if (!messageCreatedRef.current) {
              const assistantMessage: Message = {
                id: assistantMessageId,
                content: data.content,
                role: 'assistant',
                timestamp: new Date().toISOString(),
                status: 'pending',
              };
              dispatch(addMessage(assistantMessage));
              dispatch(startStreaming(assistantMessageId));
              messageCreatedRef.current = true;
            } else {
              // Append chunk to existing message
              dispatch(
                appendToMessage({
                  id: assistantMessageId,
                  content: data.content,
                })
              );
            }
          },

          onDone: (data) => {
            // Update the existing message with final data from backend
            if (assistantMessageId) {
              dispatch(
                updateMessage({
                  id: assistantMessageId,
                  updates: {
                    id: data.id,
                    content: data.content,
                    status: 'sent',
                    videoSuggestion: data.video_suggestion,
                  },
                })
              );
            }

            // Update session title if provided
            if (data.session_title) {
              dispatch(setCurrentSessionTitle(data.session_title));

              // Invalidate session cache to refresh the session list with new title
              dispatch(
                apiSlice.util.invalidateTags(
                  userRole === 'parent' ? ['ParentChatSessions'] : ['ChatSessions']
                )
              );
            }

            // Stop streaming
            dispatch(stopStreaming());
            streamingMessageIdRef.current = null;
            messageCreatedRef.current = false;
          },

          onBlocked: (data) => {
            // Handle blocked content
            dispatch(stopStreaming());
            streamingMessageIdRef.current = null;
            messageCreatedRef.current = false;

            // Update session info
            if (data.session_title) {
              dispatch(setCurrentSessionTitle(data.session_title));

              // Invalidate session cache to refresh the session list with new title
              dispatch(
                apiSlice.util.invalidateTags(
                  userRole === 'parent' ? ['ParentChatSessions'] : ['ChatSessions']
                )
              );
            }

            // Call callback if provided
            callbacks?.onBlocked?.();
          },

          onError: (error) => {
            // Handle error
            dispatch(stopStreaming());
            streamingMessageIdRef.current = null;
            messageCreatedRef.current = false;

            // Add error message
            const errorMessage: Message = {
              id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              content: 'Something went wrong. Please try again.',
              role: 'assistant',
              timestamp: new Date().toISOString(),
              status: 'error',
            };
            dispatch(addMessage(errorMessage));

            // Call callback if provided
            callbacks?.onError?.(error);
          },

          onComplete: () => {
            // Stream completed or closed
            dispatch(stopStreaming());
            streamingMessageIdRef.current = null;
            messageCreatedRef.current = false;
          },
        }, userRole);

        // Store cleanup function
        cleanupRef.current = cleanup;
      } catch (error) {
        dispatch(stopStreaming());
        streamingMessageIdRef.current = null;
        messageCreatedRef.current = false;

        const errorMessage: Message = {
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: 'Failed to connect. Please try again.',
          role: 'assistant',
          timestamp: new Date().toISOString(),
          status: 'error',
        };
        dispatch(addMessage(errorMessage));

        if (error instanceof Error) {
          callbacks?.onError?.(error.message);
        }
      }
    },
    [dispatch, userRole, currentSessionId]
  );

  /**
   * Cancel the current streaming connection
   */
  const cancelStreaming = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    dispatch(stopStreaming());
    streamingMessageIdRef.current = null;
    messageCreatedRef.current = false;
  }, [dispatch]);

  return {
    sendStreamingMessage,
    cancelStreaming,
  };
}
