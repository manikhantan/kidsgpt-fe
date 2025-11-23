import { useMemo } from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { useFutureSelf } from '@/hooks/useFutureSelf';
import { formatDecimal, getTrajectoryColor, getTrajectoryIcon } from '@/utils/timelineAnimations';
import { TrendingUp, Target, Zap, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import styles from './ProgressVisualization.module.css';

const ProgressVisualization = () => {
  const { identity } = useFutureSelf();
  const { timelineStatus, milestones, isLoading } = useTimeline();

  const graphData = useMemo(() => {
    if (!timelineStatus) return null;

    const points = [];
    const currentYear = new Date().getFullYear();
    const startAge = timelineStatus.actualAge;
    const endAge = timelineStatus.breakthroughAge;

    // Normal development line (age = thinking age)
    for (let age = startAge; age <= endAge; age++) {
      points.push({
        age,
        year: currentYear + (age - startAge),
        normalThinking: age,
        actualThinking: age === startAge ? timelineStatus.thinkingAge : null
      });
    }

    // Current point
    points[0].actualThinking = timelineStatus.thinkingAge;

    return { points, startAge, endAge, currentYear };
  }, [timelineStatus]);

  if (isLoading || !timelineStatus || !identity || !graphData) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className="skeleton-loading" style={{ height: '300px', marginBottom: '2rem' }} />
          <div className="skeleton-loading" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  const trajectoryColor = getTrajectoryColor(timelineStatus.trajectory);
  const trajectoryIcon = getTrajectoryIcon(timelineStatus.trajectory);
  const yearsAhead = timelineStatus.thinkingAge - timelineStatus.actualAge;

  return (
    <div className={styles.container}>
      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Zap />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatDecimal(timelineStatus.yearsCompressed)}</div>
            <div className={styles.statLabel}>Total Compression</div>
            <div className={styles.statSubtext}>years</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatDecimal(timelineStatus.thinkingAge)}</div>
            <div className={styles.statLabel}>Thinking Age</div>
            <div className={styles.statSubtext}>vs {timelineStatus.actualAge} actual</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <span style={{ fontSize: '1.5rem' }}>{trajectoryIcon}</span>
          </div>
          <div className={styles.statContent}>
            <div className={`${styles.statValue} ${trajectoryColor}`}>
              {timelineStatus.trajectory.charAt(0).toUpperCase() + timelineStatus.trajectory.slice(1)}
            </div>
            <div className={styles.statLabel}>Trajectory</div>
            <div className={styles.statSubtext}>current trend</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{timelineStatus.breakthroughAge}</div>
            <div className={styles.statLabel}>Breakthrough Age</div>
            <div className={styles.statSubtext}>{formatDecimal(timelineStatus.yearsToBreakthrough)} years away</div>
          </div>
        </div>
      </div>

      {/* Timeline Graph */}
      <div className={styles.graphSection}>
        <h2 className={styles.sectionTitle}>Timeline Progression</h2>
        <div className={styles.graphContainer}>
          <div className={styles.graph}>
            {/* Y-axis label */}
            <div className={styles.yAxisLabel}>Thinking Age</div>

            {/* Grid lines */}
            <div className={styles.gridLines}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.gridLine} />
              ))}
            </div>

            {/* Normal development line */}
            <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
              <line
                x1="0"
                y1="100"
                x2="100"
                y2="0"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            </svg>

            {/* Current position marker */}
            <div
              className={styles.currentPoint}
              style={{
                left: '5%',
                bottom: `${(yearsAhead / (graphData.endAge - graphData.startAge)) * 100}%`
              }}
            >
              <div className={styles.pointDot} />
              <div className={styles.pointLabel}>
                You are here<br />
                ({formatDecimal(yearsAhead)} years ahead)
              </div>
            </div>

            {/* X-axis */}
            <div className={styles.xAxis}>
              <span>{graphData.startAge}</span>
              <span>Age</span>
              <span>{graphData.endAge}</span>
            </div>
          </div>

          <div className={styles.graphLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendLineNormal} />
              <span>Normal Development</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendLineCurrent} />
              <span>Your Timeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Milestones */}
      <div className={styles.milestonesSection}>
        <h2 className={styles.sectionTitle}>
          <Calendar size={20} />
          Recent Milestones
        </h2>
        <div className={styles.milestonesList}>
          {milestones.length === 0 ? (
            <div className={styles.emptyMilestones}>
              No milestones yet. Keep learning to compress your timeline!
            </div>
          ) : (
            milestones.slice(0, 10).map((milestone) => (
              <div key={milestone.id} className={styles.milestoneCard}>
                <div className={styles.milestoneHeader}>
                  <span className={styles.milestoneConcept}>{milestone.concept}</span>
                  {milestone.yearsSaved > 0 && (
                    <span className={styles.milestoneSaved}>
                      +{formatDecimal(milestone.yearsSaved)} years
                    </span>
                  )}
                </div>
                <div className={styles.milestoneDetails}>
                  <span>Learned at age {milestone.actualAge}</span>
                  <span className={styles.milestoneSeparator}>•</span>
                  <span>Typically learned at {milestone.normalLearningAge}</span>
                  <span className={styles.milestoneSeparator}>•</span>
                  <span className={styles.milestoneDate}>
                    {format(new Date(milestone.timestamp), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressVisualization;
