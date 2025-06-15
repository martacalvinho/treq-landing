import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  category: z.string().min(1, 'Category is required'),
  manufacturer_id: z.string().optional(),
  project_id: z.string().optional(),
  reference_sku: z.string().optional(),
  dimensions: z.string().optional(),
  tag: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

interface EditMaterialFormProps {
  material: any;
  onMaterialUpdated: () => void;
}

const EditMaterialForm = ({ material, onMaterialUpdated }: EditMaterialFormProps) => {
  const { studioId } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentProjectLink, setCurrentProjectLink] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: material.name,
      category: material.category,
      manufacturer_id: material.manufacturer_id || '',
      project_id: '',
      reference_sku: material.reference_sku || '',
      dimensions: material.dimensions || '',
      tag: material.tag || '',
      location: material.location || '',
      notes: material.notes || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: material.name,
      category: material.category,
      manufacturer_id: material.manufacturer_id || '',
      project_id: currentProjectLink || '',
      reference_sku: material.reference_sku || '',
      dimensions: material.dimensions || '',
      tag: material.tag || '',
      location: material.location || '',
      notes: material.notes || '',
    });
  }, [material, currentProjectLink, form]);

  // Common tag options
  const commonTags = [
    "Sustainable", "Premium", "Fire-rated", "Water-resistant", 
    "Acoustic", "Slip-resistant", "Antibacterial", "Low-maintenance",
    "Eco-friendly", "Durable", "Flexible", "Lightweight"
  ];

  // Common location options  
  const commonLocations = [
    "Kitchen", "Bathroom", "Living Room", "Bedroom", "Office",
    "Hallway", "Basement", "Exterior", "Ceiling", "Floor",
    "Wall", "Wet Areas", "High Traffic Areas", "Commercial Spaces",
    "Library shelving", "Cabinets", "Lockers", "Storage areas"
  ];

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
    if (!studioId) return;
    try {
      console.log('Fetching active projects for studio:', studioId);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('studio_id', studioId)
        .eq('status', 'active');
      
      if (error) throw error;
      console.log('Fetched projects:', data);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchCurrentProjectLink = async () => {
    if (!studioId || !material.id) return;
    try {
      const { data, error } = await supabase
        .from('proj_materials')
        .select('project_id')
        .eq('material_id', material.id)
        .eq('studio_id', studioId)
        .maybeSingle();
      
      if (error) throw error;
      setCurrentProjectLink(data?.project_id || '');
    } catch (error) {
      console.error('Error fetching current project link:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studioId) return;
    
    try {
      setLoading(true);
      
      // Update the material including tag and location
      const { error: materialError } = await supabase
        .from('materials')
        .update({
          name: values.name,
          category: values.category,
          manufacturer_id: values.manufacturer_id || null,
          reference_sku: values.reference_sku || null,
          dimensions: values.dimensions || null,
          tag: values.tag || null,
          location: values.location || null,
          notes: values.notes || null,
        })
        .eq('id', material.id)
        .eq('studio_id', studioId);

      if (materialError) throw materialError;

      // Handle project linking
      if (currentProjectLink) {
        // Remove existing project link
        await supabase
          .from('proj_materials')
          .delete()
          .eq('material_id', material.id)
          .eq('studio_id', studioId);
      }

      if (values.project_id && values.project_id !== 'none') {
        // Add new project link
        const { error: projMaterialError } = await supabase
          .from('proj_materials')
          .insert({
            project_id: values.project_id,
            material_id: material.id,
            studio_id: studioId,
          });

        if (projMaterialError) throw projMaterialError;
      }

      toast({
        title: "Success",
        description: "Material updated successfully",
      });

      setOpen(false);
      onMaterialUpdated();
    } catch (error) {
      console.error('Error updating material:', error);
      toast({
        title: "Error",
        description: "Failed to update material",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!studioId || !confirm('Are you sure you want to delete this material?')) return;
    
    try {
      setLoading(true);
      
      // First delete any project links
      await supabase
        .from('proj_materials')
        .delete()
        .eq('material_id', material.id)
        .eq('studio_id', studioId);
      
      // Then delete the material
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', material.id)
        .eq('studio_id', studioId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Material deleted successfully",
      });

      setOpen(false);
      onMaterialUpdated();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchManufacturers();
      fetchActiveProjects();
      fetchCurrentProjectLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter material name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Flooring, Wall Covering, Furniture" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference_sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference/SKU (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Product reference or SKU number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12&quot;x24&quot;, 2m x 1m x 10mm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tag" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter location(s) - separate multiple with commas" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    Use commas to separate multiple locations (e.g., "Library shelving, Cabinets, Lockers")
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} defaultValue={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No manufacturer</SelectItem>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer.id} value={manufacturer.id}>
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link to Project (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an active project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No project</SelectItem>
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter material notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Material'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaterialForm;
