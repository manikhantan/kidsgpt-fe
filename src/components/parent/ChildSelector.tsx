import { Child } from '@/types';

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
    <div>
      <label
        htmlFor="child-selector"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Select Child
      </label>
      <select
        id="child-selector"
        value={selectedChildId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        <option value="">Choose a child...</option>
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.name} ({child.email})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChildSelector;
