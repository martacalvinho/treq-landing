
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  manufacturer_id: z.string().optional(),
  project_id: z.string().optional(),
  notes: z.string().optional(),
});

export const useAddMaterialForm = (onMaterialAdded: () => void) => {
  const { studioId } = useAuth();
  const { toast } = useToast();
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      subcategory: '',
      manufacturer_id: '',
      project_id: '',
      notes: '',
    },
  });

  const fetchManufacturers = async () => {
    if (!studioId) return;
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, name')
        .eq('studio_id', studioId);
      
      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
  };

  const fetchActiveProjects = async () => {
    if (!studioId) {
      console.log('No studioId available');
      return;
    }
    try {
      console.log('Fetching active projects for studio:', studioId);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, status')
        .eq('studio_id', studioId);
      
      if (error) throw error;
      console.log('All projects fetched:', data);
      
      // Filter for active projects, but also include other statuses for debugging
      const activeProjects = data?.filter(project => project.status === 'active') || [];
      console.log('Active projects:', activeProjects);
      
      // For now, let's show all projects to debug the issue
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studioId) return;
    
    try {
      setLoading(true);
      
      // First, create the material
      const { data: materialData, error: materialError } = await supabase
        .from('materials')
        .insert({
          name: values.name,
          category: values.category,
          subcategory: values.subcategory,
          manufacturer_id: values.manufacturer_id || null,
          notes: values.notes || null,
          studio_id: studioId,
        })
        .select()
        .single();

      if (materialError) throw materialError;

      // If a project is selected, link the material to the project
      if (values.project_id && values.project_id !== 'none' && materialData) {
        const { error: projMaterialError } = await supabase
          .from('proj_materials')
          .insert({
            project_id: values.project_id,
            material_id: materialData.id,
            studio_id: studioId,
          });

        if (projMaterialError) throw projMaterialError;
      }

      toast({
        title: "Success",
        description: "Material created successfully",
      });

      form.reset();
      onMaterialAdded();
    } catch (error) {
      console.error('Error creating material:', error);
      toast({
        title: "Error",
        description: "Failed to create material",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    manufacturers,
    projects,
    loading,
    fetchManufacturers,
    fetchActiveProjects,
    onSubmit,
  };
};
