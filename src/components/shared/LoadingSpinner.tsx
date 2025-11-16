import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './LoadingSpinner.module.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner = ({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) => {
  return (
    <div className={clsx(styles.container, styles[size], className)}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.glow} />
        <Loader2 className={styles.spinner} />
      </div>
      {text && (
        <p className={styles.text}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
