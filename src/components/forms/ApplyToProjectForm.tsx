
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FolderPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  project_id: z.string().min(1, 'Project is required'),
});

interface ApplyToProjectFormProps {
  material: any;
  onMaterialUpdated: () => void;
}

const ApplyToProjectForm = ({ material, onMaterialUpdated }: ApplyToProjectFormProps) => {
  const { studioId } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: '',
    },
  });

  const fetchActiveProjects = async () => {
    if (!studioId) return;
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('studio_id', studioId)
        .eq('status', 'active');
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studioId) return;
    
    try {
      setLoading(true);
      
      // Check if material is already linked to this project
      const { data: existingLink, error: checkError } = await supabase
        .from('proj_materials')
        .select('id')
        .eq('material_id', material.id)
        .eq('project_id', values.project_id)
        .eq('studio_id', studioId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLink) {
        toast({
          title: "Already Applied",
          description: "This material is already applied to the selected project",
          variant: "destructive",
        });
        return;
      }

      // Add material to project
      const { error: projMaterialError } = await supabase
        .from('proj_materials')
        .insert({
          project_id: values.project_id,
          material_id: material.id,
          studio_id: studioId,
        });

      if (projMaterialError) throw projMaterialError;

      const selectedProject = projects.find(p => p.id === values.project_id);

      toast({
        title: "Success",
        description: `Material applied to ${selectedProject?.name}`,
      });

      form.reset();
      setOpen(false);
      onMaterialUpdated();
    } catch (error) {
      console.error('Error applying material to project:', error);
      toast({
        title: "Error",
        description: "Failed to apply material to project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchActiveProjects();
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FolderPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply to Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Project</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Applying...' : 'Apply to Project'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyToProjectForm;
