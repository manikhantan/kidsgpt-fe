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
import { clsx } from 'clsx';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ChildInsightsDashboard } from '@/types';
import styles from './InsightsDashboard.module.css';

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
    if (percentage >= 70) return '#4ade80'; // success
    if (percentage >= 40) return '#60a5fa'; // info
    return '#facc15'; // warning
  };

  if (!hasData) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIconWrapper}>
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className={styles.emptyTitle}>No Activity Yet</h3>
        <p className={styles.emptyDescription}>
          Your child hasn't started chatting yet. Check back after they have some conversations to see their learning insights!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>{insights.child_name}'s Learning Insights</h2>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <MessageSquare className={styles.statIcon} />
              <span>{insights.total_sessions} sessions</span>
            </div>
            <div className={styles.statItem}>
              <Clock className={styles.statIcon} />
              <span>{insights.total_engagement_minutes} mins total</span>
            </div>
            <div className={styles.statItem}>
              <Calendar className={styles.statIcon} />
              <span>Active {formatTime(insights.last_activity)}</span>
            </div>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={styles.refreshButton}
          >
            <RefreshCw className={clsx(styles.statIcon, isRefreshing && styles.spin)} />
            Refresh Data
          </button>
        )}
      </div>

      {/* Learning Metrics Card */}
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={clsx(styles.iconBox, styles.iconBoxInfo)}>
            <Brain className="w-6 h-6" />
          </div>
          <h3 className={styles.cardTitle}>Learning Behavior</h3>
        </div>

        <div className={styles.metricsGrid}>
          {/* Curiosity Level */}
          <div className={styles.metricItem}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Curiosity Level</span>
              <span
                className={styles.metricValue}
                style={{ color: getLearningLevelColor(insights.learning_metrics.learning_percentage) }}
              >
                {Math.round(insights.learning_metrics.learning_percentage)}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${insights.learning_metrics.learning_percentage}%`,
                  backgroundColor: getLearningLevelColor(insights.learning_metrics.learning_percentage)
                }}
              />
            </div>
            <p className={styles.metricSubtext}>
              Asked 'why/how' questions {insights.learning_metrics.learning_questions} out of{' '}
              {insights.learning_metrics.total_questions} times
            </p>
            <p className={styles.metricFeedback} style={{ color: getLearningLevelColor(insights.learning_metrics.learning_percentage) }}>
              {insights.learning_metrics.learning_percentage >= 70
                ? '🌟 Shows great curiosity and deep learning!'
                : insights.learning_metrics.learning_percentage >= 40
                  ? '👍 Demonstrates good learning behavior'
                  : '💡 Mostly seeking quick answers'}
            </p>
          </div>

          {/* Learning Streak */}
          <div className={styles.streakContainer}>
            <div className={clsx(styles.iconBox, styles.iconBoxWarning)}>
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className={styles.streakValue}>
                {insights.learning_metrics.learning_streak_days}
              </div>
              <div className={styles.streakLabel}>Day Streak</div>
            </div>
          </div>
        </div>
      </Card>

      <div className={styles.grid}>
        {/* Top Interests Section */}
        {insights.top_interests.length > 0 && (
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={clsx(styles.iconBox, styles.iconBoxAccent)}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className={styles.cardTitle}>Top Interests</h3>
            </div>
            <div className={styles.interestList}>
              {insights.top_interests.map((interest, index) => (
                <div key={index} className={styles.interestItem}>
                  <div className={styles.rankCircle}>{index + 1}</div>
                  <div className={styles.interestContent}>
                    <h4 className={styles.interestName}>{interest.topic}</h4>
                    <div className={styles.interestMeta}>
                      <span className={styles.metaItem}>
                        <Clock className="w-3 h-3" />
                        {interest.total_time_minutes} mins
                      </span>
                      <span className={styles.metaItem}>
                        <MessageCircle className="w-3 h-3" />
                        {interest.message_count} msgs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Weekly Highlights */}
        {insights.weekly_highlights && (
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={clsx(styles.iconBox, styles.iconBoxSuccess)}>
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className={styles.cardTitle}>Weekly Highlights</h3>
            </div>

            <div className={styles.highlightsGrid}>
              {/* New Curiosity */}
              {insights.weekly_highlights.new_curiosity && (
                <div className={clsx(styles.highlightCard, styles.highlightCardSuccess)}>
                  <h4 className={clsx(styles.highlightTitle, styles.textSuccess)}>
                    <Lightbulb className="w-4 h-4" />
                    New Curiosity
                  </h4>
                  <p className={styles.highlightText}>{insights.weekly_highlights.new_curiosity}</p>
                </div>
              )}

              {/* Needs Support */}
              {insights.weekly_highlights.needs_support && (
                <div className={clsx(styles.highlightCard, styles.highlightCardWarning)}>
                  <h4 className={clsx(styles.highlightTitle, styles.textWarning)}>
                    <AlertCircle className="w-4 h-4" />
                    May Need Support
                  </h4>
                  <p className={styles.highlightText}>{insights.weekly_highlights.needs_support}</p>
                </div>
              )}

              {/* Suggested Dinner Topic */}
              {insights.weekly_highlights.suggested_dinner_topic && (
                <div className={clsx(styles.highlightCard, styles.highlightCardInfo)}>
                  <h4 className={clsx(styles.highlightTitle, styles.textInfo)}>
                    <MessageCircle className="w-4 h-4" />
                    Suggested Dinner Topic
                  </h4>
                  <p className={styles.highlightText}>"{insights.weekly_highlights.suggested_dinner_topic}"</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InsightsDashboard;
