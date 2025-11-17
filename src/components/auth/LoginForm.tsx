import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
        <div className="bg-error-light border border-error/20 text-error-dark px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        {...register('email' as keyof ParentLoginFormData)}
        type="email"
        label="Email"
        placeholder="you@example.com"
        error={(errors as { email?: { message?: string } }).email?.message}
      />

      <Input
        {...register('password')}
        type="password"
        label="Password"
        placeholder="Your password"
        error={errors.password?.message}
      />

      <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
        {type === 'parent' ? 'Sign in' : 'Sign in'}
      </Button>
    </form>
  );
};

export default LoginForm;
