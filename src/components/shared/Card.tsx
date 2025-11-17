import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', variant = 'default', hover = true, children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
      xl: 'p-8',
    };

    const variantStyles = {
      default: 'bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-soft',
      glass: 'bg-white/60 backdrop-blur-lg border border-white/30 shadow-soft',
      elevated: 'bg-white shadow-soft-lg border border-gray-50',
      bordered: 'bg-white border-2 border-gray-200 shadow-none',
    };

    const hoverStyles = hover
      ? 'hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300'
      : 'transition-colors duration-200';

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            'rounded-2xl transform-gpu',
            variantStyles[variant],
            paddingStyles[padding],
            hoverStyles,
            className
          )
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
