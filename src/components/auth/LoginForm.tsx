import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import {
  parentLoginSchema,
  kidLoginSchema,
  ParentLoginFormData,
  KidLoginFormData,
} from '@/utils/validators';

type LoginFormProps =
  | {
      type: 'parent';
      onSubmit: (data: ParentLoginFormData) => void;
      isLoading?: boolean;
      error?: string | null;
    }
  | {
      type: 'child';
      onSubmit: (data: KidLoginFormData) => void;
      isLoading?: boolean;
      error?: string | null;
    };

const LoginForm = ({ type, onSubmit, isLoading = false, error }: LoginFormProps) => {
  const schema = type === 'parent' ? parentLoginSchema : kidLoginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentLoginFormData | KidLoginFormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = (data: ParentLoginFormData | KidLoginFormData) => {
    if (type === 'parent') {
      (onSubmit as (data: ParentLoginFormData) => void)(data as ParentLoginFormData);
    } else {
      (onSubmit as (data: KidLoginFormData) => void)(data as KidLoginFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('email' as keyof ParentLoginFormData)}
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={(errors as { email?: { message?: string } }).email?.message}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          className="pl-10"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {type === 'parent' ? 'Sign In' : 'Start Chatting'}
      </Button>
    </form>
  );
};

export default LoginForm;
