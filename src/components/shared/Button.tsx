import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] transform-gpu';

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5',
      secondary:
        'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 focus:ring-secondary-500 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5',
      danger:
        'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 focus:ring-gray-400 border border-transparent hover:border-gray-200/50',
      outline:
        'bg-white/80 backdrop-blur-sm text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50/50 focus:ring-primary-500 shadow-soft',
    };

    const sizeStyles = {
      sm: 'px-3.5 py-2 text-sm rounded-lg gap-1.5',
      md: 'px-5 py-2.5 text-base rounded-xl gap-2',
      lg: 'px-7 py-3.5 text-lg rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
