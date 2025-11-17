import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'w-full rounded-xl border-2 bg-white/80 backdrop-blur-sm px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed shadow-inner-soft',
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 pr-10'
                  : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 hover:border-gray-300',
                className
              )
            )}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
