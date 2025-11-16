import { LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/utils/constants';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  sidebarOpen?: boolean;
}

const Header = ({ onMenuToggle, showMenuButton = false, sidebarOpen = true }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className={styles.toggleButton}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeft size={20} />
            )}
          </button>
        )}
        <h1 className={styles.title}>
          {APP_NAME}
        </h1>
      </div>

      <div className={styles.rightSection}>
        {user && (
          <>
            <span className={styles.userInfo}>
              {user.name}
            </span>
            <button
              onClick={logout}
              className={styles.logoutButton}
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
