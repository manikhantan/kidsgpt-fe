import { useEffect, useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { formatDecimal } from '@/utils/timelineAnimations';
import styles from './CompressionToast.module.css';

interface CompressionToastProps {
  years: number;
  concept: string;
  onClose?: () => void;
  duration?: number;
}

const CompressionToast = ({
  years,
  concept,
  onClose,
  duration = 5000
}: CompressionToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Allow fade out animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.container} compression-toast`}>
      <div className={styles.iconWrapper}>
        <Zap className={styles.icon} size={20} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          +{formatDecimal(years)} years compressed
        </div>
        <div className={styles.subtitle}>
          <Sparkles size={12} className={styles.sparkle} />
          Learned: {concept}
        </div>
      </div>
    </div>
  );
};

export default CompressionToast;
