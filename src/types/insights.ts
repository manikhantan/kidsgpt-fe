export interface TopicInsight {
  topic: string;  // e.g., "Marine biology", "Chess", "Creative writing"
  total_time_minutes: number;  // Total time spent on this topic
  message_count: number;  // Number of messages about this topic
  last_accessed: string;  // ISO datetime
}

export interface LearningMetrics {
  total_questions: number;
  learning_questions: number;  // Questions with "why/how" (showing curiosity)
  learning_percentage: number;  // 0-100 percentage
  learning_streak_days: number;  // Consecutive days with activity
}

export interface WeeklyHighlight {
  week_start: string;  // ISO date (YYYY-MM-DD)
  top_interests: TopicInsight[];  // Top 2 topics this week
  academic_focus: string | null;
  new_curiosity: string | null;  // e.g., "Started exploring chess strategies"
  needs_support: string | null;  // e.g., "Essay structure (asked 4x)"
  suggested_dinner_topic: string | null;  // e.g., "Ask about their octopus research!"
}

export interface ChildInsightsDashboard {
  child_id: string;
  child_name: string;

  // Top 5 topics of interest
  top_interests: TopicInsight[];

  // Learning behavior metrics
  learning_metrics: LearningMetrics;

  // This week's highlights
  weekly_highlights: WeeklyHighlight | null;

  // Summary statistics
  total_sessions: number;
  total_engagement_minutes: number;
  last_activity: string | null;  // ISO datetime
}

export interface RefreshInsightsResponse {
  processed_count: number;
}
