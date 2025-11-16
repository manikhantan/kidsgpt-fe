import { Users, MessageSquare, ShieldAlert, Activity, ChevronRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useGetChildrenQuery } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: children, isLoading } = useGetChildrenQuery();

  const stats = [
    {
      label: 'Children',
      value: children?.length || 0,
      icon: Users,
      wrapperClass: styles.statIconWrapperInfo,
      iconClass: styles.statIconInfo,
    },
    {
      label: 'Messages',
      value: '-',
      icon: MessageSquare,
      wrapperClass: styles.statIconWrapperSuccess,
      iconClass: styles.statIconSuccess,
    },
    {
      label: 'Blocked',
      value: '-',
      icon: ShieldAlert,
      wrapperClass: styles.statIconWrapperWarning,
      iconClass: styles.statIconWarning,
    },
    {
      label: 'Active',
      value: children?.length || 0,
      icon: Activity,
      wrapperClass: styles.statIconWrapperAccent,
      iconClass: styles.statIconAccent,
    },
  ];

  const quickActions = [
    {
      label: 'Manage Children',
      description: 'Add or edit child accounts',
      icon: Users,
      route: ROUTES.PARENT_CHILDREN,
    },
    {
      label: 'Content Control',
      description: 'Set safety filters and restrictions',
      icon: ShieldAlert,
      route: ROUTES.PARENT_CONTENT_CONTROL,
    },
    {
      label: 'Learning Insights',
      description: 'View learning patterns and interests',
      icon: Lightbulb,
      route: ROUTES.PARENT_INSIGHTS,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome back, {user?.name}
        </h1>
        <p className={styles.subtitle}>
          Here's what's happening with your children's activity.
        </p>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <Card key={stat.label} padding="md" variant="flat" hover={false}>
                <div className={styles.statContent}>
                  <div className={clsx(styles.statIconWrapper, stat.wrapperClass)}>
                    <stat.icon className={clsx(styles.statIcon, stat.iconClass)} />
                  </div>
                  <div>
                    <p className={styles.statValue}>{stat.value}</p>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Quick Actions */}
            <Card padding="none" variant="flat" hover={false}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Quick Actions</h2>
              </div>
              <div className={styles.actionList}>
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.route)}
                    className={styles.actionButton}
                  >
                    <div className={styles.actionContent}>
                      <div className={styles.actionIconWrapper}>
                        <action.icon className={styles.actionIcon} />
                      </div>
                      <div>
                        <p className={styles.actionLabel}>{action.label}</p>
                        <p className={styles.actionDescription}>{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className={styles.chevron} />
                  </button>
                ))}
              </div>
            </Card>

            {/* Children Activity */}
            <Card padding="none" variant="flat" hover={false}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Children</h2>
                {children && children.length > 0 && (
                  <span className={styles.childCount}>
                    {children.length} total
                  </span>
                )}
              </div>
              {children?.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconWrapper}>
                    <Users className={styles.emptyIcon} />
                  </div>
                  <p className={styles.emptyTitle}>No children added</p>
                  <p className={styles.emptyDescription}>Add a child to get started</p>
                  <button
                    onClick={() => navigate(ROUTES.PARENT_CHILDREN)}
                    className={styles.addChildButton}
                  >
                    Add your first child
                  </button>
                </div>
              ) : (
                <div className={styles.actionList}>
                  {children?.slice(0, 5).map((child) => (
                    <div key={child.id} className={styles.childItem}>
                      <div className={styles.childInfo}>
                        <div className={styles.childAvatar}>
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={styles.childName}>{child.name}</p>
                          <p className={styles.childStatus}>Active</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`${ROUTES.PARENT_INSIGHTS}?childId=${child.id}`)}
                        className={styles.viewInsightsButton}
                      >
                        View insights
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
