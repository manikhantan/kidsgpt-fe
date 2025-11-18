import { LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/utils/constants';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  sidebarOpen?: boolean;
}

const Header = ({ onMenuToggle, showMenuButton = false, sidebarOpen = true }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-surface border-b border-border/50 flex items-center justify-between px-4 sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="icon-btn"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </button>
        )}
        <h1 className="text-base font-semibold text-text-primary tracking-tight">
          {APP_NAME}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <span className="text-sm text-text-secondary hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="icon-btn text-text-secondary hover:text-error"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
