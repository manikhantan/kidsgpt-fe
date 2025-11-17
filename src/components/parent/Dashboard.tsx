import { Users, MessageSquare, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useGetChildrenQuery } from '@/store/api/apiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: children, isLoading } = useGetChildrenQuery();

  const stats = [
    {
      label: 'Children',
      value: children?.length || 0,
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info-light',
    },
    {
      label: 'Messages',
      value: '-',
      icon: MessageSquare,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      label: 'Blocked',
      value: '-',
      icon: ShieldAlert,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
    },
    {
      label: 'Active',
      value: children?.length || 0,
      icon: Activity,
      color: 'text-accent',
      bgColor: 'bg-accent-light',
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
      label: 'Chat History',
      description: 'Review past conversations',
      icon: MessageSquare,
      route: ROUTES.PARENT_CHAT_HISTORY,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">
          Welcome back, {user?.name}
        </h1>
        <p className="text-text-secondary mt-1">
          Here's what's happening with your children's activity.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} padding="md" variant="flat" hover={false}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card padding="none" variant="flat" hover={false}>
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
              </div>
              <div className="divide-y divide-border">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.route)}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-secondary group-hover:bg-surface-tertiary transition-colors">
                        <action.icon className="h-5 w-5 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{action.label}</p>
                        <p className="text-xs text-text-muted">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-text-secondary transition-colors" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Children Activity */}
            <Card padding="none" variant="flat" hover={false}>
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">Children</h2>
                {children && children.length > 0 && (
                  <span className="text-xs font-medium text-text-muted bg-surface-secondary px-2.5 py-1 rounded-full">
                    {children.length} total
                  </span>
                )}
              </div>
              {children?.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-text-primary mb-1">No children added</p>
                  <p className="text-xs text-text-muted mb-4">Add a child to get started</p>
                  <button
                    onClick={() => navigate(ROUTES.PARENT_CHILDREN)}
                    className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    Add your first child
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {children?.slice(0, 5).map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium">
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{child.name}</p>
                          <p className="text-xs text-text-muted">Active</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`${ROUTES.PARENT_CHAT_HISTORY}?childId=${child.id}`)}
                        className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                      >
                        View activity
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
