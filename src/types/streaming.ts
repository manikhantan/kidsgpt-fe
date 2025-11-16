import { YouTubeVideoSuggestion } from './message';

/**
 * Event types sent by the streaming API
 */
export type StreamEventType = 'user_message' | 'chunk' | 'done' | 'blocked' | 'error';

/**
 * Base event structure
 */
export interface StreamEvent {
  type: StreamEventType;
}

/**
 * User message event - sent after backend saves user's message
 */
export interface UserMessageEvent extends StreamEvent {
  type: 'user_message';
  data: {
    id: string;
    content: string;
    session_id: string;
  };
}

/**
 * Chunk event - sent continuously while AI generates response
 */
export interface ChunkEvent extends StreamEvent {
  type: 'chunk';
  data: {
    content: string;
  };
}

/**
 * Done event - sent after all chunks, response is complete
 */
export interface DoneEvent extends StreamEvent {
  type: 'done';
  data: {
    id: string;
    content: string;
    session_id: string;
    session_title: string;
    video_suggestion?: YouTubeVideoSuggestion;
  };
}

/**
 * Blocked event - sent if content is blocked by filters
 */
export interface BlockedEvent extends StreamEvent {
  type: 'blocked';
  data: {
    block_reason: string;
    message_id: string;
    session_id: string;
    session_title: string;
  };
}

/**
 * Error event - sent if something goes wrong
 */
export interface ErrorEvent extends StreamEvent {
  type: 'error';
  data: {
    error: string;
  };
}

/**
 * Union type of all possible events
 */
export type StreamingEvent = UserMessageEvent | ChunkEvent | DoneEvent | BlockedEvent | ErrorEvent;

/**
 * Callbacks for handling streaming events
 */
export interface StreamingCallbacks {
  onUserMessage?: (data: UserMessageEvent['data']) => void;
  onChunk?: (data: ChunkEvent['data']) => void;
  onDone?: (data: DoneEvent['data']) => void;
  onBlocked?: (data: BlockedEvent['data']) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

/**
 * Request payload for streaming chat
 */
export interface StreamingChatRequest {
  message: string;
  sessionId?: string;
}
