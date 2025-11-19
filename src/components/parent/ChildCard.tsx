import { User, Calendar, Trash2, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { Child } from '@/types';
import { formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import styles from './ChildCard.module.css';

interface ChildCardProps {
  child: Child;
  onDelete: (childId: string) => void;
}

const ChildCard = ({ child, onDelete }: ChildCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.infoWrapper}>
          <div className={styles.avatar}>
            <User className={styles.avatarIcon} />
          </div>
          <div>
            <h3 className={styles.name}>{child.name}</h3>
            <p className={styles.email}>{child.email}</p>
          </div>
        </div>
      </div>

      <div className={styles.meta}>
        <Calendar className={styles.metaIcon} />
        <span>Created {formatDate(child.createdAt)}</span>
      </div>

      <div className={styles.actions}>
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
