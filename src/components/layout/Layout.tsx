import { useState, ReactNode } from 'react';
import { clsx } from 'clsx';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-200',
          sidebarOpen ? 'lg:ml-[260px]' : 'ml-0'
        )}
      >
        <Header
          showMenuButton={true}
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto pl-8 pr-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
