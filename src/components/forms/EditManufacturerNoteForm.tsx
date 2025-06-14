
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Edit } from 'lucide-react';

interface EditManufacturerNoteFormProps {
  note: any;
  materials: any[];
  onNoteUpdated: () => void;
}

const EditManufacturerNoteForm = ({ note, materials, onNoteUpdated }: EditManufacturerNoteFormProps) => {
  const { studioId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_date: note.contact_date,
    material_discussed_id: note.material_discussed_id || '',
    delivery_time: note.delivery_time || '',
    notes: note.notes
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioId) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('manufacturer_notes' as any)
        .update({
          contact_date: formData.contact_date,
          material_discussed_id: formData.material_discussed_id || null,
          delivery_time: formData.delivery_time || null,
          notes: formData.notes
        })
        .eq('id', note.id);

      if (error) throw error;

      setIsOpen(false);
      onNoteUpdated();
    } catch (error) {
      console.error('Error updating manufacturer note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Manufacturer Note</DialogTitle>
          </DialogHeader>
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
                  <SelectItem value="">No material</SelectItem>
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
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Note'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditManufacturerNoteForm;
