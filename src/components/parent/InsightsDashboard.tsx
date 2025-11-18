import {
  Brain,
  Clock,
  MessageSquare,
  Flame,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  MessageCircle,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ChildInsightsDashboard, TopicInsight } from '@/types';

interface InsightsDashboardProps {
  insights: ChildInsightsDashboard;
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const InsightsDashboard = ({ insights, isLoading, onRefresh, isRefreshing }: InsightsDashboardProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasData = insights.total_sessions > 0;

  // Helper function to format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  // Helper function to get learning level color
  const getLearningLevelColor = (percentage: number) => {
    if (percentage >= 70) return 'text-success';
    if (percentage >= 40) return 'text-info';
    return 'text-warning';
  };

  // Helper function to get learning level background color
  const getLearningLevelBgColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-success-light';
    if (percentage >= 40) return 'bg-info-light';
    return 'bg-warning-light';
  };

  if (!hasData) {
    return (
      <Card className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-text-tertiary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Activity Yet</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Your child hasn't started chatting yet. Check back after they have some conversations to see their learning insights!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">{insights.child_name}'s Learning Insights</h2>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{insights.total_sessions} sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{insights.total_engagement_minutes} minutes total</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Last active {formatTime(insights.last_activity)}</span>
              </div>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </Card>

      {/* Learning Metrics Card */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-info-light flex items-center justify-center">
            <Brain className="w-5 h-5 text-info" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Learning Behavior</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Curiosity Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Curiosity Level</span>
              <span className={`text-2xl font-bold ${getLearningLevelColor(insights.learning_metrics.learning_percentage)}`}>
                {Math.round(insights.learning_metrics.learning_percentage)}%
              </span>
            </div>
            <div className="w-full bg-surface-light rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getLearningLevelBgColor(insights.learning_metrics.learning_percentage)}`}
                style={{ width: `${insights.learning_metrics.learning_percentage}%` }}
              />
            </div>
            <p className="text-xs text-text-tertiary">
              Asked 'why/how' questions {insights.learning_metrics.learning_questions} out of{' '}
              {insights.learning_metrics.total_questions} times
            </p>
            <p className="text-sm text-text-secondary">
              {insights.learning_metrics.learning_percentage >= 70
                ? '🌟 Shows great curiosity and deep learning!'
                : insights.learning_metrics.learning_percentage >= 40
                ? '👍 Demonstrates good learning behavior'
                : '💡 Mostly seeking quick answers'}
            </p>
          </div>

          {/* Learning Streak */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-warning-light flex items-center justify-center">
                <Flame className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-3xl font-bold text-text-primary">
                  {insights.learning_metrics.learning_streak_days}
                </div>
                <div className="text-sm text-text-secondary">day streak</div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              {insights.learning_metrics.learning_streak_days > 7
                ? '🔥 Amazing consistency! Keep it up!'
                : insights.learning_metrics.learning_streak_days > 3
                ? '⭐ Building a great habit!'
                : insights.learning_metrics.learning_streak_days > 0
                ? '👏 Great start!'
                : '💪 Ready to begin learning!'}
            </p>
          </div>
        </div>
      </Card>

      {/* Top Interests Section */}
      {insights.top_interests.length > 0 && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">Top Interests</h3>
          </div>

          <div className="space-y-3">
            {insights.top_interests.map((interest: TopicInsight, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-surface-light hover:bg-surface-lighter transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-1">{interest.topic}</h4>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{interest.total_time_minutes} min total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{interest.message_count} messages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Last explored {formatTime(interest.last_accessed)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Weekly Highlights Card */}
      {insights.weekly_highlights && (
        <Card className="border-2 border-accent bg-gradient-to-br from-surface to-accent-light/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">This Week's Highlights</h3>
              <p className="text-xs text-text-tertiary">
                Week of {new Date(insights.weekly_highlights.week_start).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Top Interests This Week */}
            {insights.weekly_highlights.top_interests.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Top interests this week
                </h4>
                <div className="space-y-2 ml-6">
                  {insights.weekly_highlights.top_interests.map((interest: TopicInsight, index: number) => (
                    <div key={index} className="text-sm text-text-primary">
                      • {interest.topic} <span className="text-text-tertiary">({interest.total_time_minutes} min)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Focus */}
            {insights.weekly_highlights.academic_focus && (
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Academic focus
                </h4>
                <p className="text-sm text-text-primary ml-6">{insights.weekly_highlights.academic_focus}</p>
              </div>
            )}

            {/* New Curiosity */}
            {insights.weekly_highlights.new_curiosity && (
              <div className="bg-success-light/20 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-success mb-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  New curiosity
                </h4>
                <p className="text-sm text-text-primary ml-6">{insights.weekly_highlights.new_curiosity}</p>
              </div>
            )}

            {/* Needs Support */}
            {insights.weekly_highlights.needs_support && (
              <div className="bg-warning-light/20 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-warning mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  May need support
                </h4>
                <p className="text-sm text-text-primary ml-6">{insights.weekly_highlights.needs_support}</p>
              </div>
            )}

            {/* Suggested Dinner Topic */}
            {insights.weekly_highlights.suggested_dinner_topic && (
              <div className="bg-info-light/20 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-info mb-1 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Suggested dinner topic
                </h4>
                <p className="text-sm text-text-primary ml-6">"{insights.weekly_highlights.suggested_dinner_topic}"</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default InsightsDashboard;
