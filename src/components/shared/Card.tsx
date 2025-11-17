import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'flat' | 'elevated' | 'bordered';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', variant = 'default', hover = false, children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
      xl: 'p-8',
    };

    const variantStyles = {
      default: 'bg-surface border border-border shadow-sm',
      flat: 'bg-surface border border-border',
      elevated: 'bg-surface shadow-md border border-border-light',
      bordered: 'bg-surface border border-border-dark',
    };

    const hoverStyles = hover
      ? 'hover:shadow-md hover:border-border-dark transition-all duration-200'
      : 'transition-colors duration-150';

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx('rounded-xl', variantStyles[variant], paddingStyles[padding], hoverStyles, className)
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
