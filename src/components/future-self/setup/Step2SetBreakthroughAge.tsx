import { useState } from 'react';
import { clsx } from 'clsx';
import styles from './Step2SetBreakthroughAge.module.css';

interface Step2Props {
  currentAge: number;
  onNext: (age: number) => void;
  onBack: () => void;
  initialAge?: number;
}

const Step2SetBreakthroughAge = ({ currentAge, onNext, onBack, initialAge }: Step2Props) => {
  const [breakthroughAge, setBreakthroughAge] = useState(initialAge || 25);

  const yearsFromNow = breakthroughAge - currentAge;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreakthroughAge(parseInt(e.target.value));
  };

  const handleNext = () => {
    onNext(breakthroughAge);
  };

  // Generate timeline visualization points
  const getTimelinePoints = () => {
    const points = [];
    const start = currentAge;
    const end = breakthroughAge;
    const totalYears = end - start;

    // Add current age point
    points.push({ age: start, label: 'Now', isCurrent: true });

    // Add midpoint if range is large enough
    if (totalYears >= 4) {
      const mid = Math.floor((start + end) / 2);
      points.push({ age: mid, label: `Age ${mid}`, isCurrent: false });
    }

    // Add breakthrough point
    points.push({ age: end, label: 'Breakthrough', isCurrent: false });

    return points;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Set Your Breakthrough Age</h1>
        <p className={styles.subtitle}>
          When will you achieve your biggest milestone?
        </p>
      </div>

      <div className={styles.content}>
        {/* Big Number Display */}
        <div className={styles.ageDisplay}>
          <div className={styles.ageNumber}>{breakthroughAge}</div>
          <div className={styles.ageLabel}>years old</div>
        </div>

        {/* Years from now indicator */}
        <div className={styles.yearsFromNow}>
          That's <span className={styles.highlight}>{yearsFromNow}</span> {yearsFromNow === 1 ? 'year' : 'years'} from now
        </div>

        {/* Slider */}
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min={currentAge + 1}
            max={30}
            value={breakthroughAge}
            onChange={handleSliderChange}
            className={styles.slider}
          />
          <div className={styles.sliderLabels}>
            <span>{currentAge + 1}</span>
            <span>30</span>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          {getTimelinePoints().map((point, idx) => (
            <div
              key={idx}
              className={clsx(
                styles.timelinePoint,
                point.isCurrent && styles.timelinePointCurrent
              )}
              style={{
                left: `${((point.age - currentAge) / (breakthroughAge - currentAge)) * 100}%`
              }}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineLabel}>{point.label}</div>
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        <div className={styles.motivationalMessage}>
          {yearsFromNow <= 3 && (
            <>⚡ That's soon! Your future is closer than you think.</>
          )}
          {yearsFromNow > 3 && yearsFromNow <= 6 && (
            <>🚀 Perfect timeline for major achievements!</>
          )}
          {yearsFromNow > 6 && yearsFromNow <= 10 && (
            <>🌟 Ambitious! You'll have time to master your craft.</>
          )}
          {yearsFromNow > 10 && (
            <>🎯 Long-term vision! Think of the wisdom you'll gain.</>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button onClick={handleNext} className={styles.nextButton}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step2SetBreakthroughAge;
