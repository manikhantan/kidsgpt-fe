/**
 * Timeline animation utilities for the Future Identity system
 */

/**
 * Smoothly animates a number from start to end value
 */
export const animateNumber = (
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void,
  easing: (t: number) => number = easeOutCubic
): (() => void) => {
  const startTime = performance.now();
  let animationFrame: number;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easing(progress);
    const currentValue = start + (end - start) * easedProgress;

    callback(currentValue);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    }
  };

  animationFrame = requestAnimationFrame(animate);

  // Return cleanup function
  return () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
};

/**
 * Easing function for smooth deceleration
 */
export const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

/**
 * Easing function for smooth acceleration and deceleration
 */
export const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Format a number with one decimal place
 */
export const formatDecimal = (num: number): string => {
  return num.toFixed(1);
};

/**
 * Create particle effect element
 */
export const createParticle = (container: HTMLElement, options: {
  emoji?: string;
  color?: string;
  x?: number;
  y?: number;
}) => {
  const particle = document.createElement('div');
  particle.className = 'timeline-particle';
  particle.textContent = options.emoji || '✨';

  const x = options.x ?? Math.random() * container.offsetWidth;
  const y = options.y ?? Math.random() * container.offsetHeight;

  particle.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    font-size: ${16 + Math.random() * 8}px;
    opacity: 1;
    transform: translate(-50%, -50%);
    animation: particle-float 2s ease-out forwards;
  `;

  container.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 2000);
};

/**
 * Trigger particle burst effect
 */
export const particleBurst = (
  container: HTMLElement,
  count: number = 10,
  emoji: string = '⚡'
) => {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      createParticle(container, {
        emoji,
        x: container.offsetWidth / 2,
        y: container.offsetHeight / 2
      });
    }, i * 50);
  }
};

/**
 * Add glitch effect to text element
 */
export const glitchText = (element: HTMLElement, duration: number = 200) => {
  const originalText = element.textContent || '';
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let iteration = 0;
  const maxIterations = 10;

  const interval = setInterval(() => {
    element.textContent = originalText
      .split('')
      .map((char, index) => {
        if (index < iteration) {
          return originalText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    iteration++;

    if (iteration > maxIterations) {
      clearInterval(interval);
      element.textContent = originalText;
    }
  }, duration / maxIterations);

  return () => clearInterval(interval);
};

/**
 * Shimmer effect for future slip reveals
 */
export const shimmerEffect = (element: HTMLElement) => {
  element.classList.add('shimmer-effect');

  setTimeout(() => {
    element.classList.remove('shimmer-effect');
  }, 1000);
};

/**
 * Calculate trajectory based on recent milestones
 */
export const calculateTrajectory = (
  recentCompressions: number[]
): 'accelerating' | 'steady' | 'stalled' => {
  if (recentCompressions.length < 2) {
    return 'steady';
  }

  const avg = recentCompressions.reduce((a, b) => a + b, 0) / recentCompressions.length;
  const recent = recentCompressions[recentCompressions.length - 1];

  if (recent > avg * 1.2) {
    return 'accelerating';
  } else if (recent < avg * 0.5) {
    return 'stalled';
  }

  return 'steady';
};

/**
 * Get color class based on trajectory
 */
export const getTrajectoryColor = (
  trajectory: 'accelerating' | 'steady' | 'stalled'
): string => {
  switch (trajectory) {
    case 'accelerating':
      return 'text-green-500';
    case 'steady':
      return 'text-blue-500';
    case 'stalled':
      return 'text-orange-500';
  }
};

/**
 * Get icon for trajectory
 */
export const getTrajectoryIcon = (
  trajectory: 'accelerating' | 'steady' | 'stalled'
): string => {
  switch (trajectory) {
    case 'accelerating':
      return '⬆️';
    case 'steady':
      return '➡️';
    case 'stalled':
      return '⚠️';
  }
};

/**
 * Format years remaining
 */
export const formatYearsRemaining = (years: number): string => {
  if (years < 0) {
    return `${Math.abs(years).toFixed(1)} years ahead of schedule`;
  }

  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);

  if (wholeYears === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  if (months === 0) {
    return `${wholeYears} ${wholeYears === 1 ? 'year' : 'years'}`;
  }

  return `${wholeYears} ${wholeYears === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
};
