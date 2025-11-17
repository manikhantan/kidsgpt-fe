import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, History, X, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '@/components/shared/Button';
import { ROUTES } from '@/utils/constants';
import { useAppSelector } from '@/store/hooks';
import ChatSessionsList from '@/components/chat/ChatSessionsList';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const parentNavItems = [
  {
    to: ROUTES.PARENT_DASHBOARD,
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Overview & stats',
  },
  {
    to: ROUTES.PARENT_CHILDREN,
    icon: Users,
    label: 'Manage Children',
    description: 'Add & manage kids',
  },
  {
    to: ROUTES.PARENT_CONTENT_CONTROL,
    icon: Shield,
    label: 'Content Control',
    description: 'Safety settings',
  },
  {
    to: ROUTES.PARENT_CHAT_HISTORY,
    icon: History,
    label: 'Chat History',
    description: 'View conversations',
  },
  {
    to: ROUTES.PARENT_CHAT,
    icon: MessageCircle,
    label: 'Chat',
    description: 'Talk with AI',
  },
];

const kidNavItems = [
  {
    to: ROUTES.KID_CHAT,
    icon: MessageCircle,
    label: 'Chat',
    description: 'Talk with AI',
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const isParent = user?.role === 'parent';
  const isKid = user?.role === 'child';
  const navItems = isParent ? parentNavItems : kidNavItems;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 transform transition-all duration-300 ease-out lg:transform-none shadow-soft-xl lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 lg:hidden border-b border-gray-100">
            <span className="text-lg font-bold text-gray-900">Navigation</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {isKid ? (
            // Kid user gets chat sessions list
            <ChatSessionsList onSessionClick={onClose} />
          ) : (
            // Parent user gets regular navigation
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'group flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 animate-slide-in-right',
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-soft border border-primary-100/50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    )
                  }
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={clsx(
                      'p-2.5 rounded-lg transition-all duration-200',
                      'group-[.bg-gradient-to-r]:bg-primary-100 group-[.bg-gradient-to-r]:text-primary-600',
                      'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-600">
                      {item.description}
                    </span>
                  </div>
                </NavLink>
              ))}
            </nav>
          )}

          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 font-medium">
                {isParent ? 'Parent Account' : 'Kid Account'}
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                {user?.name}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
