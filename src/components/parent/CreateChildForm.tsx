import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, AtSign, Mail } from 'lucide-react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { createChildSchema, CreateChildFormData } from '@/utils/validators';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('name')}
          type="text"
          label="Child's Name"
          placeholder="Enter child's name"
          error={errors.name?.message}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('email')}
          type="email"
          label="Child's Email"
          placeholder="Enter child's email"
          error={errors.email?.message}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <AtSign className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          {...register('username')}
          type="text"
          label="Username"
          placeholder="Create a username"
          error={errors.username?.message}
          helperText="This will be used for login"
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
          placeholder="Confirm password"
          error={errors.confirmPassword?.message}
          className="pl-10"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
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
