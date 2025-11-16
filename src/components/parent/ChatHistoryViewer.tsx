import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import ChildSelector from './ChildSelector';
import {
  useGetChildrenQuery,
  useGetChatHistoryQuery,
} from '@/store/api/apiSlice';
import { formatMessageTime, formatDate } from '@/utils/formatters';

const ChatHistoryViewer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    searchParams.get('childId')
  );

  const { data: children, isLoading: loadingChildren } = useGetChildrenQuery();
  const {
    data: chatHistory,
    isLoading: loadingHistory,
    error: historyError,
    refetch,
  } = useGetChatHistoryQuery(selectedChildId || '', {
    skip: !selectedChildId,
  });

  useEffect(() => {
    if (selectedChildId) {
      setSearchParams({ childId: selectedChildId });
    }
  }, [selectedChildId, setSearchParams]);

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId);
  };

  if (loadingChildren) {
    return <LoadingSpinner size="lg" text="Loading..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Chat History</h2>
        <p className="text-gray-600 mt-1">
          View your children's conversation history with the AI assistant.
        </p>
      </div>

      <Card padding="lg">
        <ChildSelector
          children={children || []}
          selectedChildId={selectedChildId}
          onSelect={handleChildSelect}
        />
      </Card>

      {!selectedChildId ? (
        <Card className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a child to view history
          </h3>
          <p className="text-gray-600">
            Choose a child from the dropdown above to see their chat history.
          </p>
        </Card>
      ) : loadingHistory ? (
        <LoadingSpinner size="lg" text="Loading chat history..." className="py-12" />
      ) : historyError ? (
        <ErrorMessage
          message="Failed to load chat history. Please try again."
          onRetry={refetch}
        />
      ) : chatHistory?.sessions.length === 0 ? (
        <Card className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No chat history yet
          </h3>
          <p className="text-gray-600">
            This child hasn't started any conversations yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card padding="none">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Messages: {chatHistory?.totalMessages || 0}
                </span>
                <span className="text-sm text-orange-600">
                  Blocked Attempts: {chatHistory?.blockedAttempts || 0}
                </span>
              </div>
            </div>
          </Card>

          {chatHistory?.sessions.map((session) => (
            <Card key={session.id} padding="none">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-900">
                  Session: {formatDate(session.startedAt)}
                </h3>
              </div>
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {session.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.blocked
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {message.blocked && (
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Blocked Content
                          </span>
                        </div>
                      )}
                      <p className="break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryViewer;
