import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

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
  const sizeStyles = {
    sm: 'h-5 w-5',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary-400 rounded-full blur-lg opacity-20 animate-pulse-soft" />
        <Loader2
          className={clsx('animate-spin text-primary-600 relative', sizeStyles[size])}
        />
      </div>
      {text && (
        <p className={clsx('font-medium text-gray-600 animate-pulse-soft', textSizeStyles[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
