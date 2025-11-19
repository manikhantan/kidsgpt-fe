import { ChevronDown } from 'lucide-react';
import { Child } from '@/types';
import styles from './ChildSelector.module.css';

interface ChildSelectorProps {
  children: Child[];
  selectedChildId: string | null;
  onSelect: (childId: string) => void;
}

const ChildSelector = ({
  children,
  selectedChildId,
  onSelect,
}: ChildSelectorProps) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Select Child:</label>
      <div className={styles.selectWrapper}>
        <select
          value={selectedChildId || ''}
          onChange={(e) => onSelect(e.target.value)}
          className={styles.select}
        >
          <option value="" disabled>
            Choose a child...
          </option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} />
      </div>
    </div>
  );
};

export default ChildSelector;
