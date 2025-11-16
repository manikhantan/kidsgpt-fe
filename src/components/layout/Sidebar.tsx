import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, History, X } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '@/components/shared/Button';
import { ROUTES } from '@/utils/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    to: ROUTES.PARENT_DASHBOARD,
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: ROUTES.PARENT_CHILDREN,
    icon: Users,
    label: 'Children',
  },
  {
    to: ROUTES.PARENT_CONTENT_CONTROL,
    icon: Shield,
    label: 'Content Control',
  },
  {
    to: ROUTES.PARENT_CHAT_HISTORY,
    icon: History,
    label: 'Chat History',
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold">Menu</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
