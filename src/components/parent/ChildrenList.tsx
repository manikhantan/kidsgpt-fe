import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import ChildCard from './ChildCard';
import CreateChildForm from './CreateChildForm';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import {
  useGetChildrenQuery,
  useCreateChildMutation,
  useDeleteChildMutation,
} from '@/store/api/apiSlice';
import { CreateChildFormData } from '@/utils/validators';

const ChildrenList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: children, isLoading, error, refetch } = useGetChildrenQuery();
  const [createChild, { isLoading: isCreating }] = useCreateChildMutation();
  const [deleteChild, { isLoading: isDeleting }] = useDeleteChildMutation();

  const handleCreateChild = async (data: CreateChildFormData) => {
    try {
      setFormError(null);
      const { confirmPassword: _, ...createData } = data;
      await createChild(createData).unwrap();
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      setFormError('Failed to create child account. Email may already exist.');
    }
  };

  const handleDeleteChild = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteChild(deleteConfirmId).unwrap();
      refetch();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete child:', err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading children..." className="py-12" />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load children. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Children</h2>
        <Button
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Child
        </Button>
      </div>

      {children?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No children yet</h3>
          <p className="text-gray-600 mb-4">
            Create a child account to get started.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Add Your First Child</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children?.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormError(null);
        }}
        title="Create Child Account"
      >
        <CreateChildForm
          onSubmit={handleCreateChild}
          isLoading={isCreating}
          error={formError}
          onCancel={() => {
            setIsModalOpen(false);
            setFormError(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Child Account"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this child account? This action cannot be
            undone and all chat history will be lost.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteChild}
              isLoading={isDeleting}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChildrenList;
