import { LogOut, Menu, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import { APP_NAME } from '@/utils/constants';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header = ({ onMenuToggle, showMenuButton = false }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.name}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
