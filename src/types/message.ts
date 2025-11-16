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
  startedAt: string;
  endedAt?: string;
  messages: Message[];
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
}

export interface ChatHistoryResponse {
  sessions: ChatSession[];
  totalMessages: number;
  blockedAttempts: number;
}
