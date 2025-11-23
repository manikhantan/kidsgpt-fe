import { useState } from 'react';
import { IdentityType, AMBITION_PLACEHOLDERS } from '@/types';
import { clsx } from 'clsx';
import styles from './Step3DefineAmbition.module.css';

interface Step3Props {
  identityType: IdentityType;
  placeholders: typeof AMBITION_PLACEHOLDERS;
  onNext: (ambition: string) => void;
  onBack: () => void;
  isSubmitting: boolean;
  initialAmbition?: string;
}

const Step3DefineAmbition = ({
  identityType,
  placeholders,
  onNext,
  onBack,
  isSubmitting,
  initialAmbition
}: Step3Props) => {
  const [ambition, setAmbition] = useState(initialAmbition || '');
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ambition.trim() && !isSubmitting) {
      onNext(ambition.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setAmbition(e.target.value);
    }
  };

  const canSubmit = ambition.trim().length > 0 && !isSubmitting;
  const charactersRemaining = maxLength - ambition.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Define Your Ambition</h1>
        <p className={styles.subtitle}>
          What do you want to be known for?
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.textareaWrapper}>
          <textarea
            value={ambition}
            onChange={handleChange}
            placeholder={placeholders[identityType]}
            className={styles.textarea}
            rows={6}
            autoFocus
            disabled={isSubmitting}
          />
          <div className={styles.characterCount}>
            <span className={clsx(charactersRemaining < 50 && styles.characterCountLow)}>
              {charactersRemaining}
            </span>
            {' '}characters remaining
          </div>
        </div>

        <div className={styles.inspirationBox}>
          <div className={styles.inspirationIcon}>💡</div>
          <div>
            <h3 className={styles.inspirationTitle}>Think big, be specific</h3>
            <p className={styles.inspirationText}>
              Don't just say "be successful" - describe the impact you want to make.
              What problem will you solve? Who will you help? What will change because of you?
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={onBack}
            className={styles.backButton}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={clsx(
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled
            )}
          >
            {isSubmitting ? (
              <span className={styles.loadingText}>
                Creating your future...
              </span>
            ) : (
              'Activate Timeline'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3DefineAmbition;
