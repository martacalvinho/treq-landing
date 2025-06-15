
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMaterialLimits } from '@/hooks/useMaterialLimits';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  manufacturer_id: z.string().optional(),
  reference_sku: z.string().optional(),
  dimensions: z.string().optional(),
  tag: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  // Advanced pricing fields
  price_per_sqft: z.string().optional(),
  price_per_unit: z.string().optional(),
  unit_type: z.enum(['sqft', 'unit', 'both']).optional(),
});

interface AddMaterialFormProps {
  onMaterialAdded: () => void;
}

const AddMaterialForm = ({ onMaterialAdded }: AddMaterialFormProps) => {
  const { studioId } = useAuth();
  const { canAddMaterial, isBlocked } = useMaterialLimits();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      subcategory: '',
      manufacturer_id: '',
      reference_sku: '',
      dimensions: '',
      tag: '',
      location: '',
      notes: '',
      price_per_sqft: '',
      price_per_unit: '',
      unit_type: undefined,
    },
  });

  useEffect(() => {
    if (open && studioId) {
      fetchManufacturers();
    }
  }, [open, studioId]);

  const fetchManufacturers = async () => {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studioId) return;
    
    try {
      setLoading(true);
      
      const materialData = {
        name: values.name,
        category: values.category,
        subcategory: values.subcategory || null,
        manufacturer_id: values.manufacturer_id || null,
        reference_sku: values.reference_sku || null,
        dimensions: values.dimensions || null,
        tag: values.tag || null,
        location: values.location || null,
        notes: values.notes || null,
        studio_id: studioId,
        // Add pricing fields
        price_per_sqft: values.price_per_sqft ? parseFloat(values.price_per_sqft) : null,
        price_per_unit: values.price_per_unit ? parseFloat(values.price_per_unit) : null,
        unit_type: values.unit_type || null,
      };

      const { error } = await supabase
        .from('materials')
        .insert([materialData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Material added successfully",
      });

      form.reset();
      setOpen(false);
      onMaterialAdded();
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: "Error",
        description: "Failed to add material",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isBlocked) {
    return (
      <Button disabled variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add Material (Plan Upgrade Required)
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canAddMaterial}>
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
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
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hardwood, Carpet, Paint" {...field} />
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
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No manufacturer</SelectItem>
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

            {/* Advanced Pricing Section */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Advanced Pricing Options
                  </div>
                  {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="unit_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pricing type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sqft">Price per Square Foot</SelectItem>
                          <SelectItem value="unit">Price per Unit</SelectItem>
                          <SelectItem value="both">Both (Sqft & Unit)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.watch('unit_type') === 'sqft' || form.watch('unit_type') === 'both') && (
                  <FormField
                    control={form.control}
                    name="price_per_sqft"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Square Foot ($)</FormLabel>
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

                {(form.watch('unit_type') === 'unit' || form.watch('unit_type') === 'both') && (
                  <FormField
                    control={form.control}
                    name="price_per_unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Unit ($)</FormLabel>
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
              </CollapsibleContent>
            </Collapsible>

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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Material'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterialForm;
