import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User } from 'lucide-react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { parentRegisterSchema, ParentRegisterFormData } from '@/utils/validators';
import styles from './RegisterForm.module.css';

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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.inputWrapper}>
        <User className={styles.icon} />
        <Input
          {...register('name')}
          type="text"
          label="Full Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.inputWrapper}>
        <Mail className={styles.icon} />
        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.inputWrapper}>
        <Lock className={styles.icon} />
        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="Create a password"
          error={errors.password?.message}
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.inputWrapper}>
        <Lock className={styles.icon} />
        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          className={styles.inputWithIcon}
        />
      </div>

      <Button
        type="submit"
        className={styles.submitButton}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
