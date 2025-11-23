import { useEffect, useRef, useState } from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { useFutureSelf } from '@/hooks/useFutureSelf';
import {
  getTrajectoryColor,
  getTrajectoryIcon,
  formatYearsRemaining,
  animateNumber,
  formatDecimal
} from '@/utils/timelineAnimations';
import { Zap, TrendingUp, Target } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './TimelineDashboard.module.css';

const TimelineDashboard = () => {
  const { identity } = useFutureSelf();
  const { timelineStatus, isLoading } = useTimeline();
  const [displayThinkingAge, setDisplayThinkingAge] = useState(0);
  const [displayYearsAhead, setDisplayYearsAhead] = useState(0);
  const prevThinkingAgeRef = useRef(0);
  const prevYearsAheadRef = useRef(0);

  // Animate numbers when they change
  useEffect(() => {
    if (timelineStatus) {
      const thinkingAge = timelineStatus.thinkingAge;
      const yearsAhead = thinkingAge - timelineStatus.actualAge;

      // Animate thinking age
      if (Math.abs(thinkingAge - prevThinkingAgeRef.current) > 0.01) {
        const cleanup = animateNumber(
          prevThinkingAgeRef.current || thinkingAge,
          thinkingAge,
          800,
          (val) => setDisplayThinkingAge(val)
        );
        prevThinkingAgeRef.current = thinkingAge;
        return cleanup;
      } else {
        setDisplayThinkingAge(thinkingAge);
      }

      // Animate years ahead
      if (Math.abs(yearsAhead - prevYearsAheadRef.current) > 0.01) {
        const cleanup = animateNumber(
          prevYearsAheadRef.current || yearsAhead,
          yearsAhead,
          800,
          (val) => setDisplayYearsAhead(val)
        );
        prevYearsAheadRef.current = yearsAhead;
        return cleanup;
      } else {
        setDisplayYearsAhead(yearsAhead);
      }
    }
  }, [timelineStatus]);

  if (!identity || !timelineStatus) {
    return null;
  }

  if (isLoading && !timelineStatus) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className="skeleton-loading" style={{ height: '20px', marginBottom: '8px' }} />
          <div className="skeleton-loading" style={{ height: '40px', marginBottom: '8px' }} />
          <div className="skeleton-loading" style={{ height: '16px' }} />
        </div>
      </div>
    );
  }

  const trajectoryColor = getTrajectoryColor(timelineStatus.trajectory);
  const trajectoryIcon = getTrajectoryIcon(timelineStatus.trajectory);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Zap className={styles.headerIcon} size={16} />
        <h3 className={styles.title}>Timeline Status</h3>
      </div>

      <div className={styles.content}>
        {/* Thinking Age Display */}
        <div className={styles.mainStat}>
          <div className={styles.statLabel}>You think like a</div>
          <div className={clsx(styles.statValue, 'thinking-age-display')}>
            {formatDecimal(displayThinkingAge)}
          </div>
          <div className={styles.statSuffix}>year old</div>
          <div className={styles.statSubtext}>
            (You're actually {timelineStatus.actualAge})
          </div>
        </div>

        {/* Years Ahead */}
        <div className={styles.metricRow}>
          <TrendingUp size={16} className={styles.metricIcon} />
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>
              {formatDecimal(displayYearsAhead)} years
            </div>
            <div className={styles.metricLabel}>ahead of schedule</div>
          </div>
        </div>

        {/* Trajectory */}
        <div className={clsx(
          styles.metricRow,
          timelineStatus.trajectory === 'accelerating' && 'trajectory-accelerating'
        )}>
          <span className={styles.trajectoryIcon}>{trajectoryIcon}</span>
          <div className={styles.metricContent}>
            <div className={clsx(styles.metricValue, trajectoryColor)}>
              {timelineStatus.trajectory.charAt(0).toUpperCase() + timelineStatus.trajectory.slice(1)}
            </div>
            <div className={styles.metricLabel}>Trajectory</div>
          </div>
        </div>

        {/* Breakthrough Progress */}
        <div className={styles.breakthroughSection}>
          <div className={styles.breakthroughHeader}>
            <Target size={14} />
            <span>Breakthrough in:</span>
          </div>
          <div className={styles.breakthroughTime}>
            {formatYearsRemaining(timelineStatus.yearsToBreakthrough)}
          </div>
          <div className={styles.breakthroughYear}>
            ({timelineStatus.breakthroughAge} years old)
          </div>
        </div>
      </div>

      {/* Compression Indicator */}
      {timelineStatus.yearsCompressed > 0 && (
        <div className={styles.compressionBadge}>
          <Zap size={12} />
          <span>{formatDecimal(timelineStatus.yearsCompressed)} years compressed</span>
        </div>
      )}
    </div>
  );
};

export default TimelineDashboard;
