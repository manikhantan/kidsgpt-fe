import { useState } from 'react';
import { IdentityCardData, IdentityType } from '@/types';
import { clsx } from 'clsx';
import styles from './Step1ChooseIdentity.module.css';

interface Step1Props {
  identityCards: IdentityCardData[];
  onNext: (type: IdentityType, customType?: string) => void;
  initialSelection?: IdentityType;
}

const Step1ChooseIdentity = ({ identityCards, onNext, initialSelection }: Step1Props) => {
  const [selectedType, setSelectedType] = useState<IdentityType | null>(initialSelection || null);
  const [customIdentity, setCustomIdentity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(initialSelection === 'custom');

  const handleCardClick = (type: IdentityType) => {
    setSelectedType(type);
    if (type === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  };

  const handleNext = () => {
    if (!selectedType) return;

    if (selectedType === 'custom' && !customIdentity.trim()) {
      return;
    }

    onNext(
      selectedType,
      selectedType === 'custom' ? customIdentity.trim() : undefined
    );
  };

  const canProceed = selectedType && (selectedType !== 'custom' || customIdentity.trim().length > 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose Your Future Identity</h1>
        <p className={styles.subtitle}>
          Who do you want to become? Select the path that calls to you.
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {identityCards.map((card) => (
          <button
            key={card.type}
            className={clsx(
              styles.identityCard,
              'identity-card',
              selectedType === card.type && 'selected'
            )}
            onClick={() => handleCardClick(card.type)}
          >
            <div className={clsx(styles.cardGradient, `bg-gradient-to-br ${card.gradient}`)}>
              <div className={styles.cardIcon}>{card.icon}</div>
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDescription}>{card.description}</p>
            <div className={styles.cardAchievements}>
              {card.exampleAchievements.map((achievement, idx) => (
                <div key={idx} className={styles.achievement}>
                  <span className={styles.achievementDot}>•</span>
                  <span className={styles.achievementText}>{achievement}</span>
                </div>
              ))}
            </div>
          </button>
        ))}

        {/* Custom Identity Option */}
        <button
          className={clsx(
            styles.identityCard,
            styles.customCard,
            'identity-card',
            selectedType === 'custom' && 'selected'
          )}
          onClick={() => handleCardClick('custom')}
        >
          <div className={styles.cardGradient}>
            <div className={styles.cardIcon}>✨</div>
          </div>
          <h3 className={styles.cardTitle}>Create Your Own</h3>
          <p className={styles.cardDescription}>
            Define your own unique future identity
          </p>
        </button>
      </div>

      {showCustomInput && (
        <div className={styles.customInputContainer}>
          <input
            type="text"
            value={customIdentity}
            onChange={(e) => setCustomIdentity(e.target.value)}
            placeholder="e.g., Environmental Scientist, Game Developer..."
            className={styles.customInput}
            maxLength={50}
            autoFocus
          />
        </div>
      )}

      <div className={styles.footer}>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={clsx(styles.nextButton, !canProceed && styles.nextButtonDisabled)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step1ChooseIdentity;
