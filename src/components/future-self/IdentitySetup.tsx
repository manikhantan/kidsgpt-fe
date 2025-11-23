import { useState } from 'react';
import { IDENTITY_CARDS, AMBITION_PLACEHOLDERS, IdentityType, CreateFutureIdentityRequest } from '@/types';
import { useFutureSelf } from '@/hooks/useFutureSelf';
import { useTimeline } from '@/hooks/useTimeline';
import Step1ChooseIdentity from './setup/Step1ChooseIdentity';
import Step2SetBreakthroughAge from './setup/Step2SetBreakthroughAge';
import Step3DefineAmbition from './setup/Step3DefineAmbition';
import Step4ActivationMoment from './setup/Step4ActivationMoment';
import styles from './IdentitySetup.module.css';

interface IdentitySetupProps {
  onComplete?: () => void;
  currentAge?: number;
}

const IdentitySetup = ({ onComplete, currentAge = 14 }: IdentitySetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateFutureIdentityRequest>>({
    currentAge,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createIdentity } = useFutureSelf();
  const { loadTimelineStatus } = useTimeline();

  const handleStep1Complete = (type: IdentityType, customType?: string) => {
    setFormData(prev => ({ ...prev, type, customType }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (breakthroughAge: number) => {
    setFormData(prev => ({ ...prev, breakthroughAge }));
    setCurrentStep(3);
  };

  const handleStep3Complete = async (ambition: string) => {
    const finalData: CreateFutureIdentityRequest = {
      type: formData.type!,
      customType: formData.customType,
      breakthroughAge: formData.breakthroughAge!,
      ambition,
      currentAge: formData.currentAge || currentAge,
    };

    setFormData({ ...formData, ambition });
    setIsSubmitting(true);

    try {
      // Create the identity
      await createIdentity(finalData);

      // Load initial timeline status
      await loadTimelineStatus();

      // Move to activation moment
      setCurrentStep(4);
    } catch (error) {
      console.error('Failed to create identity:', error);
      setIsSubmitting(false);
      // Show error to user
      alert('Failed to create your future identity. Please try again.');
    }
  };

  const handleActivationComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Progress Indicator */}
        {currentStep < 4 && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
            <p className={styles.progressText}>Step {currentStep} of 3</p>
          </div>
        )}

        {/* Step Content */}
        <div className="wizard-step">
          {currentStep === 1 && (
            <Step1ChooseIdentity
              identityCards={IDENTITY_CARDS}
              onNext={handleStep1Complete}
              initialSelection={formData.type}
            />
          )}

          {currentStep === 2 && (
            <Step2SetBreakthroughAge
              currentAge={currentAge}
              onNext={handleStep2Complete}
              onBack={handleBack}
              initialAge={formData.breakthroughAge}
            />
          )}

          {currentStep === 3 && (
            <Step3DefineAmbition
              identityType={formData.type!}
              placeholders={AMBITION_PLACEHOLDERS}
              onNext={handleStep3Complete}
              onBack={handleBack}
              isSubmitting={isSubmitting}
              initialAmbition={formData.ambition}
            />
          )}

          {currentStep === 4 && (
            <Step4ActivationMoment
              identity={formData as CreateFutureIdentityRequest}
              onComplete={handleActivationComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentitySetup;
