import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User } from 'lucide-react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { parentRegisterSchema, ParentRegisterFormData } from '@/utils/validators';

interface RegisterFormProps {
  onSubmit: (data: ParentRegisterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

const RegisterForm = ({ onSubmit, isLoading = false, error }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentRegisterFormData>({
    resolver: zodResolver(parentRegisterSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="relative">
        <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('name')}
          type="text"
          label="Full Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="Create a password"
          error={errors.password?.message}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          className="pl-10"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
