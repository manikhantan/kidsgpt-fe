import { createContext, useContext, useState, ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './Tabs.module.css';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
}

export const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={styles.tabsRoot}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
}

export const TabsList = ({ children }: TabsListProps) => {
  return <div className={styles.tabsList}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
}

export const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      className={clsx(styles.tabsTrigger, isActive && styles.tabsTriggerActive)}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export const TabsContent = ({ value, children }: TabsContentProps) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) {
    return null;
  }

  return <div className={styles.tabsContent}>{children}</div>;
};
