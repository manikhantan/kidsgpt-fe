import { User, Calendar, Trash2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { Child } from '@/types';
import { formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

interface ChildCardProps {
  child: Child;
  onDelete: (childId: string) => void;
}

const ChildCard = ({ child, onDelete }: ChildCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-3 rounded-full">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
            <p className="text-sm text-gray-500">@{child.username}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="h-4 w-4" />
        <span>Created {formatDate(child.createdAt)}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<History className="h-4 w-4" />}
          onClick={() => navigate(`${ROUTES.PARENT_CHAT_HISTORY}?childId=${child.id}`)}
        >
          View History
        </Button>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={() => onDelete(child.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default ChildCard;
