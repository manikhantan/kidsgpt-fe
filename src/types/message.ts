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

export interface SendMessageResponse {
  id: string;
  response: string;
  blocked: boolean;
  blockedReason?: string;
  allowedTopics?: string[];
  sessionId?: string;
  sessionTitle?: string;
}

export interface ChatHistoryResponse {
  sessions: ChatSession[];
  totalMessages: number;
  blockedAttempts: number;
}
