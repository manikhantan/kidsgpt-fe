import { useEffect, useState } from 'react';
import { CreateFutureIdentityRequest } from '@/types';
import { IDENTITY_CARDS } from '@/types';
import styles from './Step4ActivationMoment.module.css';

interface Step4Props {
  identity: CreateFutureIdentityRequest;
  onComplete: () => void;
}

const Step4ActivationMoment = ({ identity, onComplete }: Step4Props) => {
  const [stage, setStage] = useState<'connecting' | 'timeline' | 'welcome' | 'complete'>('connecting');

  const identityCard = IDENTITY_CARDS.find(card => card.type === identity.type);
  const identityName = identity.customType || identityCard?.title || 'Future Self';

  useEffect(() => {
    // Stage 1: Connecting (2 seconds)
    const timer1 = setTimeout(() => {
      setStage('timeline');
    }, 2000);

    // Stage 2: Timeline animation (2 seconds)
    const timer2 = setTimeout(() => {
      setStage('welcome');
    }, 4000);

    // Stage 3: Welcome message (3 seconds)
    const timer3 = setTimeout(() => {
      setStage('complete');
    }, 7000);

    // Auto-complete after showing everything (1 second after complete)
    const timer4 = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const currentYear = new Date().getFullYear();
  const yearsFromNow = identity.breakthroughAge - identity.currentAge;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {stage === 'connecting' && (
          <div className={styles.stage}>
            <div className={styles.spinner}>
              <div className={styles.spinnerRing} />
              <div className={styles.spinnerRing} />
              <div className={styles.spinnerRing} />
            </div>
            <h2 className={styles.stageTitle}>Your future self is connecting...</h2>
            <p className={styles.stageText}>
              Establishing timeline link to {currentYear + yearsFromNow}
            </p>
          </div>
        )}

        {stage === 'timeline' && (
          <div className={styles.stage}>
            <div className={styles.timelineAnimation}>
              <div className={styles.timelineBar}>
                <div className={styles.timelineProgress} />
              </div>
              <div className={styles.timelineYears}>
                <div className={styles.timelineYear}>
                  <div className={styles.timelineDot} />
                  <span>{currentYear}</span>
                </div>
                <div className={styles.timelineYear}>
                  <div className={styles.timelineDot} />
                  <span>{currentYear + yearsFromNow}</span>
                </div>
              </div>
            </div>
            <h2 className={styles.stageTitle}>Timeline activated</h2>
            <p className={styles.stageText}>
              Connection established with {identityName}
            </p>
          </div>
        )}

        {(stage === 'welcome' || stage === 'complete') && (
          <div className={styles.stage}>
            <div className={styles.welcomeIcon}>
              {identityCard?.icon || '✨'}
            </div>
            <h2 className={styles.welcomeTitle}>
              Welcome back to {currentYear}
            </h2>
            <p className={styles.welcomeText}>
              Your future as a <span className={styles.identityHighlight}>{identityName}</span> is now part of your timeline.
            </p>
            <div className={styles.ambitionBox}>
              <p className={styles.ambitionLabel}>Your Mission:</p>
              <p className={styles.ambitionText}>"{identity.ambition}"</p>
            </div>
            <p className={styles.activationText}>
              Let's accelerate your timeline ⚡
            </p>
            {stage === 'complete' && (
              <button onClick={onComplete} className={styles.enterButton}>
                Enter Timeline
              </button>
            )}
          </div>
        )}
      </div>

      {/* Background particles effect */}
      <div className={styles.particlesBackground}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Step4ActivationMoment;
