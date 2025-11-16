import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage = ({
  title = 'Error',
  message,
  onRetry,
  className,
}: ErrorMessageProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 ${className}`}
    >
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-4">{message}</p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
