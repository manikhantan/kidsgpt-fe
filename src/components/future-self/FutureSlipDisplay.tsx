import { useEffect, useRef, useState } from 'react';
import { FutureSlip } from '@/types';
import { formatFutureSlip } from '@/utils/futureSlipFormatter';
import { shimmerEffect } from '@/utils/timelineAnimations';
import { AlertTriangle } from 'lucide-react';
import styles from './FutureSlipDisplay.module.css';

interface FutureSlipDisplayProps {
  slip: FutureSlip;
  onReveal?: () => void;
}

const FutureSlipDisplay = ({ slip, onReveal }: FutureSlipDisplayProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const slipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Delay before showing the slip
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);

      // Apply shimmer effect
      if (slipRef.current) {
        shimmerEffect(slipRef.current);
      }

      // Notify parent
      if (onReveal) {
        onReveal();
      }
    }, 1500);

    return () => clearTimeout(revealTimer);
  }, [onReveal]);

  if (!isRevealed) {
    return null;
  }

  const formattedText = formatFutureSlip(slip);

  return (
    <div ref={slipRef} className={`${styles.container} slip-reveal`}>
      <div className={styles.header}>
        <AlertTriangle size={16} className={styles.icon} />
        <span className={styles.headerText}>Timeline Slip Detected</span>
      </div>

      <div className={`${styles.content} future-slip-text`}>
        {formattedText.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>
          Achievement added to your timeline
        </span>
      </div>
    </div>
  );
};

export default FutureSlipDisplay;
