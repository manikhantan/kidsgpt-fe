import { BarChart3 } from 'lucide-react';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useGetAnalyticsQuery } from '@/store/api/apiSlice';
import { formatNumber } from '@/utils/formatters';

interface AnalyticsCardProps {
  childId: string;
}

const AnalyticsCard = ({ childId }: AnalyticsCardProps) => {
  const { data: analytics, isLoading } = useGetAnalyticsQuery(childId);

  if (isLoading) {
    return <LoadingSpinner size="sm" />;
  }

  if (!analytics) {
    return null;
  }

  return (
    <Card padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Messages</p>
          <p className="text-xl font-bold text-gray-900">
            {formatNumber(analytics.totalMessages)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Chats</p>
          <p className="text-xl font-bold text-gray-900">
            {formatNumber(analytics.totalChats)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Blocked Attempts</p>
          <p className="text-xl font-bold text-orange-600">
            {formatNumber(analytics.blockedAttempts)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Avg Session Length</p>
          <p className="text-xl font-bold text-gray-900">
            {analytics.averageSessionLength} min
          </p>
        </div>
      </div>

      {analytics.mostAskedTopics.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Most Asked Topics</p>
          <div className="flex flex-wrap gap-2">
            {analytics.mostAskedTopics.map((topic) => (
              <span
                key={topic}
                className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AnalyticsCard;
