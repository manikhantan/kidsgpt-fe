import { API_BASE_URL } from '@/utils/constants';
import { getToken } from './auth';
import type { StreamingCallbacks, StreamingChatRequest } from '@/types/streaming';

/**
 * Parse a Server-Sent Events message
 */
function parseSSEMessage(rawData: string): { event: string; data: string } | null {
  const lines = rawData.split('\n');
  let event = 'message';
  let data = '';

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      data = line.slice(5).trim();
    }
  }

  if (data) {
    return { event, data };
  }

  return null;
}

/**
 * Create a streaming chat connection using fetch and ReadableStream
 * This approach works better than EventSource for authenticated requests
 */
export async function createStreamingChat(
  request: StreamingChatRequest,
  callbacks: StreamingCallbacks,
  userRole: 'kid' | 'parent' = 'kid'
): Promise<() => void> {
  const token = getToken();
  if (!token) {
    callbacks.onError?.('Authentication required');
    return () => {};
  }

  const controller = new AbortController();
  const signal = controller.signal;

  // Determine the endpoint based on user role
  const endpoint = userRole === 'parent'
    ? `${API_BASE_URL}/api/parent/chat/stream`
    : `${API_BASE_URL}/api/kid/chat/stream`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      callbacks.onError?.(`HTTP ${response.status}: ${errorText}`);
      callbacks.onComplete?.();
      return () => controller.abort();
    }

    if (!response.body) {
      callbacks.onError?.('No response body');
      callbacks.onComplete?.();
      return () => controller.abort();
    }

    // Process the stream
    processStream(response.body, callbacks, signal);

    // Return cleanup function
    return () => {
      controller.abort();
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        // Connection was intentionally aborted
        console.log('Streaming connection aborted');
      } else {
        callbacks.onError?.(error.message);
      }
    } else {
      callbacks.onError?.('Unknown error occurred');
    }
    callbacks.onComplete?.();
    return () => {};
  }
}

/**
 * Process the readable stream and parse SSE events
 */
async function processStream(
  stream: ReadableStream<Uint8Array>,
  callbacks: StreamingCallbacks,
  signal: AbortSignal
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal.aborted) {
        break;
      }

      const { done, value } = await reader.read();

      if (done) {
        callbacks.onComplete?.();
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete messages (separated by double newline)
      const messages = buffer.split('\n\n');
      buffer = messages.pop() || ''; // Keep the incomplete message in buffer

      for (const message of messages) {
        if (!message.trim()) continue;

        const parsed = parseSSEMessage(message);
        if (!parsed) continue;

        try {
          const data = JSON.parse(parsed.data);
          handleEvent(parsed.event, data, callbacks);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      callbacks.onError?.(error.message);
    }
  } finally {
    reader.releaseLock();
    callbacks.onComplete?.();
  }
}

/**
 * Handle a parsed SSE event
 */
function handleEvent(event: string, data: any, callbacks: StreamingCallbacks): void {
  switch (event) {
    case 'user_message':
      callbacks.onUserMessage?.({
        id: data.id,
        content: data.content,
        session_id: data.session_id,
      });
      break;

    case 'chunk':
      callbacks.onChunk?.({
        content: data.content,
      });
      break;

    case 'done':
      callbacks.onDone?.({
        id: data.id,
        content: data.content,
        session_id: data.session_id,
        session_title: data.session_title,
        video_suggestion: data.video_suggestion,
      });
      break;

    case 'blocked':
      callbacks.onBlocked?.({
        block_reason: data.block_reason,
        message_id: data.message_id,
        session_id: data.session_id,
        session_title: data.session_title,
      });
      break;

    case 'error':
      callbacks.onError?.(data.error);
      break;

    default:
      console.warn('Unknown SSE event type:', event);
  }
}
