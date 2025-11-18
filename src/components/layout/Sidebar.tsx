import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  X,
  MessageCircle,
  Plus,
  ChevronDown,
  Lightbulb
} from 'lucide-react';
import { clsx } from 'clsx';
import { ROUTES } from '@/utils/constants';
import { useAppSelector } from '@/store/hooks';
import ChatSessionsList from '@/components/chat/ChatSessionsList';
import ParentChatSessionsList from '@/components/parent/ParentChatSessionsList';
import { useCreateNewChat } from '@/hooks/useCreateNewChat';
import { useCreateNewParentChat } from '@/hooks/useCreateNewParentChat';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const parentNavItems = [
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
    to: ROUTES.PARENT_INSIGHTS,
    icon: Lightbulb,
    label: 'Insights',
  },
  {
    to: ROUTES.PARENT_CHAT,
    icon: MessageCircle,
    label: 'Chat',
  },
];

const kidNavItems = [
  {
    to: ROUTES.KID_CHAT,
    icon: MessageCircle,
    label: 'Chat',
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const isParent = user?.role === 'parent';
  const isKid = user?.role === 'child';
  const navItems = isParent ? parentNavItems : kidNavItems;

  const isParentOnChatPage = isParent && (
    location.pathname === ROUTES.PARENT_CHAT ||
    location.pathname === ROUTES.PARENT_ALL_CHATS
  );

  // Hooks for creating new chats
  const { createNewChat: createNewKidChat } = useCreateNewChat({ onSuccess: onClose });
  const { createNewChat: createNewParentChat } = useCreateNewParentChat({ onSuccess: onClose });

  const handleNewChat = () => {
    if (isParent) {
      createNewParentChat();
    } else if (isKid) {
      createNewKidChat();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-30 w-[260px] bg-sidebar flex flex-col',
          'transform transition-transform duration-200 ease-out lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 h-14">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 flex-1 p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
          >
            <Plus className="h-4 w-4 text-sidebar-text" />
            <span className="text-sm text-sidebar-text">New chat</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors lg:hidden"
          >
            <X className="h-4 w-4 text-sidebar-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
          {isKid ? (
            <ChatSessionsList onSessionClick={onClose} />
          ) : isParentOnChatPage ? (
            <ParentChatSessionsList onSessionClick={onClose} />
          ) : (
            <nav className="space-y-1 py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'sidebar-item group',
                      isActive && 'bg-sidebar-hover'
                    )
                  }
                >
                  <item.icon className="h-4 w-4 text-sidebar-text-muted group-hover:text-sidebar-text" />
                  <span className="text-sidebar-text group-hover:text-sidebar-text">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-hover transition-colors group">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm text-sidebar-text truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-text-muted capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-sidebar-text-muted" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
