import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Mail } from 'lucide-react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { createChildSchema, CreateChildFormData } from '@/utils/validators';
import styles from './CreateChildForm.module.css';

interface CreateChildFormProps {
  onSubmit: (data: CreateChildFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  onCancel: () => void;
}

const CreateChildForm = ({
  onSubmit,
  isLoading = false,
  error,
  onCancel,
}: CreateChildFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateChildFormData>({
    resolver: zodResolver(createChildSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}

      <div className={styles.inputWrapper}>
        <User className={styles.inputIcon} />
        <Input
          {...register('name')}
          type="text"
          label="Child's Name"
          placeholder="Enter child's name"
          error={errors.name?.message}
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.inputWrapper}>
        <Mail className={styles.inputIcon} />
        <Input
          {...register('email')}
          type="email"
          label="Child's Email"
          placeholder="Enter child's email"
          error={errors.email?.message}
          helperText="This will be used for login"
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.inputWrapper}>
        <Lock className={styles.inputIcon} />
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
        <Lock className={styles.inputIcon} />
        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          placeholder="Confirm password"
          error={errors.confirmPassword?.message}
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel} className={styles.actionButton}>
          Cancel
        </Button>
        <Button
          type="submit"
          className={styles.actionButton}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Child Account
        </Button>
      </div>
    </form>
  );
};

export default CreateChildForm;
