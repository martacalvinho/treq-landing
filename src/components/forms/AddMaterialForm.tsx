
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { useAddMaterialForm } from './add-material/useAddMaterialForm';
import MaterialFormFields from './add-material/MaterialFormFields';

interface AddMaterialFormProps {
  onMaterialAdded: () => void;
}

const AddMaterialForm = ({ onMaterialAdded }: AddMaterialFormProps) => {
  const [open, setOpen] = useState(false);
  
  const {
    form,
    manufacturers,
    projects,
    loading,
    fetchManufacturers,
    fetchActiveProjects,
    onSubmit,
  } = useAddMaterialForm(() => {
    setOpen(false);
    onMaterialAdded();
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchManufacturers();
      fetchActiveProjects();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-coral hover:bg-coral-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <MaterialFormFields 
              form={form}
              manufacturers={manufacturers}
              projects={projects}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Material'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterialForm;
