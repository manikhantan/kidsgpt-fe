import { AlertTriangle, Lightbulb } from 'lucide-react';

interface BlockedNotificationProps {
  allowedTopics?: string[];
}

const BlockedNotification = ({ allowedTopics = [] }: BlockedNotificationProps) => {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 my-4 mx-auto max-w-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-orange-800">
            Oops! That topic isn't available right now.
          </h3>
          <p className="text-orange-700 mt-2">
            Don't worry! There are lots of other fun things we can talk about!
          </p>

          {allowedTopics.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-orange-800 mb-2">
                <Lightbulb className="h-5 w-5" />
                <span className="font-medium">Try asking about:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allowedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
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
  );
};

export default BlockedNotification;
