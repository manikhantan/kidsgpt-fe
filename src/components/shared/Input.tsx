import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              styles.input,
              error && styles.errorInput,
              className
            )}
            {...props}
          />
          {error && (
            <div className={styles.errorIcon}>
              <AlertCircle />
            </div>
          )}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
