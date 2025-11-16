import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

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
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No items added yet</p>
        ) : (
          items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default TopicManager;
