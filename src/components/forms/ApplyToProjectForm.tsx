
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
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  project_id: z.string().min(1, 'Project is required'),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  square_feet: z.string().optional(),
  cost_per_sqft: z.string().optional(),
  cost_per_unit: z.string().optional(),
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
      quantity: '',
      unit: '',
      location: '',
      notes: '',
      square_feet: '',
      cost_per_sqft: material.price_per_sqft?.toString() || '',
      cost_per_unit: material.price_per_unit?.toString() || '',
    },
  });

  const squareFeet = parseFloat(form.watch('square_feet') || '0');
  const costPerSqft = parseFloat(form.watch('cost_per_sqft') || '0');
  const quantity = parseFloat(form.watch('quantity') || '0');
  const costPerUnit = parseFloat(form.watch('cost_per_unit') || '0');
  
  const totalCost = (squareFeet * costPerSqft) + (quantity * costPerUnit);

  useEffect(() => {
    if (open && studioId) {
      fetchActiveProjects();
    }
  }, [open, studioId]);

  const fetchActiveProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('studio_id', studioId)
        .eq('status', 'active')
        .order('name');

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
      
      const projMaterialData = {
        project_id: values.project_id,
        material_id: material.id,
        studio_id: studioId,
        quantity: values.quantity ? parseFloat(values.quantity) : null,
        unit: values.unit || null,
        location: values.location || null,
        notes: values.notes || null,
        square_feet: values.square_feet ? parseFloat(values.square_feet) : null,
        cost_per_sqft: values.cost_per_sqft ? parseFloat(values.cost_per_sqft) : null,
        cost_per_unit: values.cost_per_unit ? parseFloat(values.cost_per_unit) : null,
        total_cost: totalCost > 0 ? totalCost : null,
      };

      const { error } = await supabase
        .from('proj_materials')
        .upsert([projMaterialData], {
          onConflict: 'project_id,material_id,studio_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Material applied to project successfully",
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Apply to Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply "{material.name}" to Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Project</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an active project" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., sqft, pieces, boxes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Advanced Pricing Section */}
            {(material.price_per_sqft || material.price_per_unit) && (
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium">Cost Calculation</h4>
                
                {material.price_per_sqft && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="square_feet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Feet</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost_per_sqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost per Sqft ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {material.price_per_unit && (
                  <FormField
                    control={form.control}
                    name="cost_per_unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost per Unit ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {totalCost > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estimated Total Cost:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location in Project (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Kitchen, Bathroom, Living Room" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes for this material in the project..." {...field} />
                  </FormControl>
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
