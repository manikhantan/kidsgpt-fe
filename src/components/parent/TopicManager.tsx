import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import styles from './TopicManager.module.css';

interface TopicManagerProps {
  label: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder?: string;
}

const TopicManager = ({
  label,
  items,
  onAdd,
  onRemove,
  placeholder = 'Add new item...',
}: TopicManagerProps) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      <div className={styles.inputGroup}>
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className={styles.input}
        />
        <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Add
        </Button>
      </div>

      <div className={styles.tagsContainer}>
        {items.length === 0 ? (
          <p className={styles.emptyText}>No items added yet</p>
        ) : (
          items.map((item) => (
            <span key={item} className={styles.tag}>
              {item}
              <button
                onClick={() => onRemove(item)}
                className={styles.removeButton}
              >
                <X className={styles.removeIcon} />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default TopicManager;
