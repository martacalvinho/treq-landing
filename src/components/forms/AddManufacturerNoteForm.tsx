
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

interface AddManufacturerNoteFormProps {
  manufacturerId: string;
  materials: any[];
  onNoteAdded: () => void;
}

const AddManufacturerNoteForm = ({ manufacturerId, materials, onNoteAdded }: AddManufacturerNoteFormProps) => {
  const { studioId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_date: new Date().toISOString().split('T')[0],
    material_discussed_id: '',
    delivery_time: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioId) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('manufacturer_notes' as any)
        .insert([
          {
            manufacturer_id: manufacturerId,
            studio_id: studioId,
            contact_date: formData.contact_date,
            material_discussed_id: formData.material_discussed_id || null,
            delivery_time: formData.delivery_time || null,
            notes: formData.notes
          }
        ]);

      if (error) throw error;

      setFormData({
        contact_date: new Date().toISOString().split('T')[0],
        material_discussed_id: '',
        delivery_time: '',
        notes: ''
      });
      setIsOpen(false);
      onNoteAdded();
    } catch (error) {
      console.error('Error adding manufacturer note:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Note
      </Button>
    );
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-semibold mb-4">Add Manufacturer Note</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="contact_date">Contact Date</Label>
          <Input
            id="contact_date"
            type="date"
            value={formData.contact_date}
            onChange={(e) => setFormData({ ...formData, contact_date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="material_discussed">Material Discussed (Optional)</Label>
          <Select
            value={formData.material_discussed_id}
            onValueChange={(value) => setFormData({ ...formData, material_discussed_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a material" />
            </SelectTrigger>
            <SelectContent>
              {materials.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="delivery_time">Delivery Time (Optional)</Label>
          <Input
            id="delivery_time"
            value={formData.delivery_time}
            onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
            placeholder="e.g., 2-3 weeks, 5 business days"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="What was discussed, requested, or any other relevant information..."
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} size="sm">
            {loading ? 'Adding...' : 'Add Note'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddManufacturerNoteForm;
