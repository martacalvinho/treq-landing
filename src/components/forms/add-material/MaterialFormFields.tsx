
import { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

interface MaterialFormFieldsProps {
  form: UseFormReturn<any>;
  manufacturers: any[];
  projects: any[];
}

const MaterialFormFields = ({ form, manufacturers, projects }: MaterialFormFieldsProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  
  const selectedCategory = form.watch('category');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
      // Reset subcategory when category changes
      if (form.getValues('subcategory')) {
        form.setValue('subcategory', '');
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, form]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from('material_subcategories')
        .select('category')
        .order('category');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      // Get unique categories
      const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubcategories = async (category: string) => {
    try {
      setLoadingSubcategories(true);
      const { data, error } = await supabase
        .from('material_subcategories')
        .select('subcategory')
        .eq('category', category)
        .order('subcategory');
      
      if (error) {
        console.error('Error fetching subcategories:', error);
        return;
      }
      
      setSubcategories(data?.map(item => item.subcategory) || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    form.setValue('category', category);
    form.setValue('subcategory', ''); // Reset subcategory when category changes
  };

  return (
    <>
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
            <Select onValueChange={handleCategoryChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
        name="subcategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subcategory</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={!selectedCategory || loadingSubcategories}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={
                    !selectedCategory 
                      ? "Select a category first" 
                      : loadingSubcategories 
                        ? "Loading subcategories..." 
                        : "Select a subcategory"
                  } />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory}
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
            <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} defaultValue={field.value || "none"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">No project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.status})
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
    </>
  );
};

export default MaterialFormFields;
