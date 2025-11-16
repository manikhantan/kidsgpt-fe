import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { ROUTES } from '@/utils/constants';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center" padding="lg">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={ROUTES.HOME}>
          <Button leftIcon={<Home className="h-4 w-4" />}>Go Home</Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;
