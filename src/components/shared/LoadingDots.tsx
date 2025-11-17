import { Bot } from 'lucide-react';

interface LoadingDotsProps {
  variant?: 'default' | 'simple';
  className?: string;
}

const LoadingDots = ({ variant = 'default', className = '' }: LoadingDotsProps) => {
  if (variant === 'simple') {
    return (
      <div className={`flex justify-start px-4 pb-2 ${className}`}>
        <div className="bg-gray-200 rounded-2xl px-4 py-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-start px-6 pb-3 ${className}`}>
      <div className="flex items-center gap-3 animate-slide-up">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Bot className="h-5 w-5 text-gray-600" />
        </div>
        <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3.5 shadow-soft border border-gray-100">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDots;
