import { LogOut, Menu, Sparkles } from 'lucide-react';
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
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-30 animate-pulse-soft" />
              <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-2.5 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold text-gray-900">{user.name}</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="h-4 w-4" />}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
