import { Users, MessageSquare, ShieldAlert, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
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
      label: 'Total Children',
      value: children?.length || 0,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Messages',
      value: '-',
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Blocked Attempts',
      value: '-',
      icon: ShieldAlert,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Active Today',
      value: children?.length || 0,
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-8 text-white shadow-soft-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E\")" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary-200" />
            <span className="text-sm font-medium text-primary-200">Dashboard Overview</span>
          </div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-primary-100 mt-2 text-lg">
            Here's an overview of your children's activity and safety status.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                padding="lg"
                variant="glass"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${stat.bgGradient}`}>
                  <div className={`h-full w-3/4 rounded-full bg-gradient-to-r ${stat.gradient}`} />
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card padding="lg" variant="elevated" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Quick Actions
                </h2>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  3 actions
                </span>
              </div>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-between group hover:bg-primary-50 hover:border-primary-100"
                  onClick={() => navigate(ROUTES.PARENT_CHILDREN)}
                  rightIcon={<ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Manage Children</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between group hover:bg-primary-50 hover:border-primary-100"
                  onClick={() => navigate(ROUTES.PARENT_CONTENT_CONTROL)}
                  rightIcon={<ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Content Control</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between group hover:bg-primary-50 hover:border-primary-100"
                  onClick={() => navigate(ROUTES.PARENT_CHAT_HISTORY)}
                  rightIcon={<ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <span className="font-medium">View Chat History</span>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card padding="lg" variant="elevated" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
                {children && children.length > 0 && (
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                    {children.length} children
                  </span>
                )}
              </div>
              {children?.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-1">
                    No activity yet
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Add a child to get started!
                  </p>
                  <Button
                    onClick={() => navigate(ROUTES.PARENT_CHILDREN)}
                    size="sm"
                  >
                    Add Child
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {children?.slice(0, 5).map((child, index) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-primary-50 hover:to-primary-100/30 transition-all duration-200 group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-xl shadow-soft">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block">{child.name}</span>
                          <span className="text-xs text-gray-500">Active user</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `${ROUTES.PARENT_CHAT_HISTORY}?childId=${child.id}`
                          )
                        }
                        className="opacity-70 group-hover:opacity-100"
                      >
                        View
                      </Button>
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
