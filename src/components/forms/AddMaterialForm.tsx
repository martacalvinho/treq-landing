
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMaterialLimits } from '@/hooks/useMaterialLimits';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MaterialLimitDialog from '@/components/dialogs/MaterialLimitDialog';

const categories = [
  'Flooring', 'Lighting', 'Furniture', 'Textiles', 'Art & Accessories', 
  'Window Treatments', 'Wall Finishes', 'Plumbing', 'Hardware', 'Other'
];

interface AddMaterialFormProps {
  onMaterialAdded?: () => void;
}

const AddMaterialForm = ({ onMaterialAdded }: AddMaterialFormProps) => {
  const [open, setOpen] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tag, setTag] = useState('');
  const [location, setLocation] = useState('');
  const [referenceSku, setReferenceSku] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  
  const { user, studioId } = useAuth();
  const { canAddMaterial, checkAndHandleMaterialLimit, incrementMaterialCount } = useMaterialLimits();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check material limits first
    const canProceed = await checkAndHandleMaterialLimit();
    if (!canProceed) {
      setPendingSubmit(true);
      setLimitDialogOpen(true);
      return;
    }

    await submitMaterial();
  };

  const submitMaterial = async () => {
    if (!user || !studioId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('materials')
        .insert({
          name,
          category,
          subcategory: subcategory || null,
          tag: tag || null,
          location: location || null,
          reference_sku: referenceSku || null,
          dimensions: dimensions || null,
          notes: notes || null,
          studio_id: studioId,
        });

      if (error) throw error;

      // Increment material count after successful creation
      await incrementMaterialCount();

      toast({
        title: "Material added",
        description: "Your material has been added to the library.",
      });

      // Reset form
      setName('');
      setCategory('');
      setSubcategory('');
      setTag('');
      setLocation('');
      setReferenceSku('');
      setDimensions('');
      setNotes('');
      setOpen(false);
      setPendingSubmit(false);
      
      if (onMaterialAdded) {
        onMaterialAdded();
      }
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: "Error",
        description: "Failed to add material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLimitDialogConfirm = () => {
    if (pendingSubmit) {
      submitMaterial();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-coral hover:bg-coral-dark text-white"
            disabled={!canAddMaterial}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription>
              Add a new material to your library.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Material Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter material name"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g., Hardwood, Ceramic, etc."
              />
            </div>
            <div>
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g., Sustainable, Budget-friendly"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Storage location or showroom"
              />
            </div>
            <div>
              <Label htmlFor="referenceSku">Reference SKU</Label>
              <Input
                id="referenceSku"
                value={referenceSku}
                onChange={(e) => setReferenceSku(e.target.value)}
                placeholder="Product SKU or code"
              />
            </div>
            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g., 12x12 inches, 2x4 feet"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this material"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Material"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <MaterialLimitDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        onConfirm={handleLimitDialogConfirm}
      />
    </>
  );
};

export default AddMaterialForm;
