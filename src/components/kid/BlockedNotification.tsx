import { AlertTriangle } from 'lucide-react';

interface BlockedNotificationProps {
  allowedTopics?: string[];
}

const BlockedNotification = ({ allowedTopics = [] }: BlockedNotificationProps) => {
  return (
    <div className="message-container-assistant">
      <div className="message-content">
        <div className="message-avatar bg-warning-light">
          <AlertTriangle className="h-4 w-4 text-warning-dark" />
        </div>
        <div className="flex-1">
          <div className="bg-warning-light rounded-lg p-4">
            <h3 className="text-sm font-semibold text-warning-dark mb-1">Content Blocked</h3>
            <p className="text-sm text-warning-dark/90">
              This topic has been restricted. Try asking about something else.
            </p>

            {allowedTopics.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-warning-dark mb-2">Suggested topics:</p>
                <div className="flex flex-wrap gap-2">
                  {allowedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="bg-warning/10 text-warning-dark px-2.5 py-1 rounded-md text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedNotification;
