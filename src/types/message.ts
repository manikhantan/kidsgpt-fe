export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'sent' | 'pending' | 'blocked' | 'error';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  status?: MessageStatus;
  blocked?: boolean;
  blockedReason?: string;
  allowedTopics?: string[];
}

export interface ChatSession {
  id: string;
  childId: string;
  title?: string;
  startedAt: string;
  endedAt?: string;
  messages: Message[];
  lastMessageAt?: string;
  messageCount?: number;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  preview?: string;
}

export interface PaginatedChatSessions {
  sessions: ChatSessionSummary[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SendMessageRequest {
  message: string;
}

// Backend message response format
export interface BackendMessageResponse {
  id: string;
  session_id: string;
  role: string;
  content: string;
  blocked: boolean;
  block_reason: string | null;
  created_at: string;
}

export interface SendMessageResponse {
  user_message: BackendMessageResponse;
  assistant_message: BackendMessageResponse | null;
  was_blocked: boolean;
  block_reason: string | null;
  session_id: string;
  session_title: string;
}

// Parent chat response format (same as kid chat)
export interface ParentChatResponse {
  user_message: BackendMessageResponse;
  assistant_message: BackendMessageResponse;
  session_id: string;
  session_title: string;
}

export interface ChatHistoryResponse {
  sessions: ChatSession[];
  totalMessages: number;
  blockedAttempts: number;
}
