import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  X,
  MessageCircle,
  Plus,
  ChevronDown,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';
import { ROUTES } from '@/utils/constants';
import { useAppSelector } from '@/store/hooks';
import ChatSessionsList from '@/components/chat/ChatSessionsList';
import ParentChatSessionsList from '@/components/parent/ParentChatSessionsList';
import TimelineDashboard from '@/components/future-self/TimelineDashboard';
import { useCreateNewChat } from '@/hooks/useCreateNewChat';
import { useCreateNewParentChat } from '@/hooks/useCreateNewParentChat';
import { useFutureSelf } from '@/hooks/useFutureSelf';
import styles from './Sidebar.module.css';

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
  {
    to: ROUTES.KID_PROGRESS,
    icon: TrendingUp,
    label: 'Progress',
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const isParent = user?.role === 'parent';
  const isKid = user?.role === 'child';
  const navItems = isParent ? parentNavItems : kidNavItems;
  const { hasIdentity } = useFutureSelf();

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
    <aside
      className={clsx(
        styles.sidebar,
        isOpen ? styles.sidebarOpen : styles.sidebarClosed
      )}
    >
      {/* Header */}
      <div className={styles.header}>
        {(isKid || isParentOnChatPage) && (
          <button
            onClick={handleNewChat}
            className={styles.newChatButton}
          >
            <Plus />
            <span>New chat</span>
          </button>
        )}
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Timeline Dashboard for kids with identity */}
        {isKid && hasIdentity && (
          <div style={{ marginBottom: '1rem' }}>
            <TimelineDashboard />
          </div>
        )}

        {isKid ? (
          <ChatSessionsList onSessionClick={() => {
            if (window.innerWidth < 1024) onClose();
          }} />
        ) : isParentOnChatPage ? (
          <ParentChatSessionsList onSessionClick={() => {
            if (window.innerWidth < 1024) onClose();
          }} />
        ) : (
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  clsx(styles.navItem, isActive && styles.navItemActive)
                }
              >
                <item.icon className={styles.navIcon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.userButton}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userRole}>{user?.role}</p>
          </div>
          <ChevronDown className={styles.chevron} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
