
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface DeleteStudioFormProps {
  studio: {
    id: string;
    name: string;
  };
  onStudioDeleted: () => void;
}

const DeleteStudioForm = ({ studio, onStudioDeleted }: DeleteStudioFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('studios')
        .delete()
        .eq('id', studio.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Studio deleted successfully",
      });

      setOpen(false);
      onStudioDeleted();
    } catch (error) {
      console.error('Error deleting studio:', error);
      toast({
        title: "Error",
        description: "Failed to delete studio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Studio</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{studio.name}"? This action cannot be undone and will remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Studio'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudioForm;
