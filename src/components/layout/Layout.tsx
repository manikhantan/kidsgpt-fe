import { useState, ReactNode } from 'react';
import { clsx } from 'clsx';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Overlay */}
      <div
        className={clsx(styles.overlay, sidebarOpen && styles.overlayVisible)}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={clsx(
          styles.mainWrapper,
          sidebarOpen && styles.mainWrapperShifted
        )}
      >
        <Header
          showMenuButton={true}
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
