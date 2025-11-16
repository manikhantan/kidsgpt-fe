import { Users, MessageSquare, ShieldAlert, Activity } from 'lucide-react';
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
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Messages',
      value: '-',
      icon: MessageSquare,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Blocked Attempts',
      value: '-',
      icon: ShieldAlert,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Active Today',
      value: children?.length || 0,
      icon: Activity,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your children's activity.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner size="md" text="Loading dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  leftIcon={<Users className="h-5 w-5" />}
                  onClick={() => navigate(ROUTES.PARENT_CHILDREN)}
                >
                  Manage Children
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  leftIcon={<ShieldAlert className="h-5 w-5" />}
                  onClick={() => navigate(ROUTES.PARENT_CONTENT_CONTROL)}
                >
                  Content Control
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  leftIcon={<MessageSquare className="h-5 w-5" />}
                  onClick={() => navigate(ROUTES.PARENT_CHAT_HISTORY)}
                >
                  View Chat History
                </Button>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              {children?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No activity yet. Add a child to get started!
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate(ROUTES.PARENT_CHILDREN)}
                  >
                    Add Child
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {children?.slice(0, 5).map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="font-medium">{child.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `${ROUTES.PARENT_CHAT_HISTORY}?childId=${child.id}`
                          )
                        }
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
