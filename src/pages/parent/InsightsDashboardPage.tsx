import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import ChildSelector from '@/components/parent/ChildSelector';
import InsightsDashboard from '@/components/parent/InsightsDashboard';
import {
  useGetChildrenQuery,
  useGetChildInsightsQuery,
  useRefreshChildInsightsMutation,
} from '@/store/api/apiSlice';

const InsightsDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    searchParams.get('childId')
  );

  const { data: children, isLoading: loadingChildren } = useGetChildrenQuery();
  const {
    data: insights,
    isLoading: loadingInsights,
    error: insightsError,
    refetch,
  } = useGetChildInsightsQuery(selectedChildId || '', {
    skip: !selectedChildId,
  });

  const [refreshInsights, { isLoading: isRefreshing }] = useRefreshChildInsightsMutation();

  useEffect(() => {
    if (selectedChildId) {
      setSearchParams({ childId: selectedChildId });
    }
  }, [selectedChildId, setSearchParams]);

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId);
  };

  const handleRefresh = async () => {
    if (!selectedChildId) return;

    try {
      await refreshInsights(selectedChildId).unwrap();
      // Refetch the insights after refresh
      refetch();
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    }
  };

  if (loadingChildren) {
    return <LoadingSpinner size="lg" text="Loading..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Learning Insights</h2>
        <p className="text-text-secondary mt-1">
          Track your child's learning journey with privacy-focused insights.
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
          <Lightbulb className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Select a child to view insights
          </h3>
          <p className="text-text-secondary">
            Choose a child from the dropdown above to see their learning insights.
          </p>
        </Card>
      ) : loadingInsights ? (
        <LoadingSpinner size="lg" text="Loading insights..." className="py-12" />
      ) : insightsError ? (
        <ErrorMessage
          message="Failed to load insights. Please try again."
          onRetry={refetch}
        />
      ) : insights ? (
        <InsightsDashboard
          insights={insights}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      ) : null}
    </div>
  );
};

export default InsightsDashboardPage;
