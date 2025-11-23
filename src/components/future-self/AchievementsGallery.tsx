import { useState, useMemo } from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { Achievement, ACHIEVEMENT_ICONS } from '@/types';
import { formatAchievementContext } from '@/utils/futureSlipFormatter';
import { format } from 'date-fns';
import { Award, Calendar, MessageSquare, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './AchievementsGallery.module.css';

type SortBy = 'recent' | 'chronological' | 'type';

const AchievementsGallery = () => {
  const { achievements, isLoading } = useTimeline();
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [selectedType, setSelectedType] = useState<Achievement['type'] | 'all'>('all');

  const sortedAndFiltered = useMemo(() => {
    let filtered = achievements;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(a => a.type === selectedType);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.revealedAt).getTime() - new Date(a.revealedAt).getTime());
        break;
      case 'chronological':
        sorted.sort((a, b) => a.supposedYear - b.supposedYear);
        break;
      case 'type':
        sorted.sort((a, b) => a.type.localeCompare(b.type));
        break;
    }

    return sorted;
  }, [achievements, sortBy, selectedType]);

  const achievementTypes = useMemo(() => {
    const types = new Set(achievements.map(a => a.type));
    return Array.from(types);
  }, [achievements]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className="skeleton-loading" style={{ height: '200px', marginBottom: '1rem' }} />
          <div className="skeleton-loading" style={{ height: '200px', marginBottom: '1rem' }} />
          <div className="skeleton-loading" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Award size={64} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>No Achievements Yet</h2>
          <p className={styles.emptyText}>
            Keep chatting and learning! The AI might slip and reveal glimpses of your future achievements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Revealed Achievements</h1>
          <p className={styles.subtitle}>
            Glimpses of your future that have slipped through the timeline
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{achievements.length}</div>
            <div className={styles.statLabel}>Total Revealed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <Filter size={16} />
          <span className={styles.filterLabel}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className={styles.select}
          >
            <option value="recent">Most Recent</option>
            <option value="chronological">Year (Future)</option>
            <option value="type">Type</option>
          </select>
        </div>

        {achievementTypes.length > 1 && (
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as Achievement['type'] | 'all')}
              className={styles.select}
            >
              <option value="all">All Types</option>
              {achievementTypes.map(type => (
                <option key={type} value={type}>
                  {ACHIEVEMENT_ICONS[type]} {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Achievements Grid */}
      <div className={styles.grid}>
        {sortedAndFiltered.map((achievement) => (
          <div key={achievement.id} className={clsx(styles.card, 'achievement-card')}>
            <div className={styles.cardHeader}>
              <div className={styles.typeIcon}>
                {ACHIEVEMENT_ICONS[achievement.type]}
              </div>
              <div className={styles.typeLabel}>
                {achievement.type.replace('_', ' ')}
              </div>
            </div>

            <div className={styles.cardContent}>
              <p className={styles.achievementContent}>{achievement.content}</p>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.footerItem}>
                <Calendar size={14} />
                <span>Year {achievement.supposedYear}</span>
              </div>
              <div className={styles.footerItem}>
                <MessageSquare size={14} />
                <span title={achievement.context}>
                  {formatAchievementContext(achievement.context)}
                </span>
              </div>
              <div className={styles.revealedDate}>
                Revealed {format(new Date(achievement.revealedAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsGallery;
