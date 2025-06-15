
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, DollarSign, Calculator } from 'lucide-react';

interface MaterialPricingInputProps {
  material: any;
  onPricingUpdated: () => void;
}

const MaterialPricingInput = ({ material, onPricingUpdated }: MaterialPricingInputProps) => {
  const { studioId } = useAuth();
  const { toast } = useToast();
  const [pricePerSqft, setPricePerSqft] = useState(material.price_per_sqft?.toString() || '');
  const [pricePerUnit, setPricePerUnit] = useState(material.price_per_unit?.toString() || '');
  const [unitType, setUnitType] = useState(material.unit_type || 'sqft');
  const [totalArea, setTotalArea] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset form when material changes
  useEffect(() => {
    setPricePerSqft(material.price_per_sqft?.toString() || '');
    setPricePerUnit(material.price_per_unit?.toString() || '');
    setUnitType(material.unit_type || 'sqft');
    setTotalArea('');
    setTotalUnits('');
  }, [material.id]); // Use material.id instead of material to prevent unnecessary resets

  const calculateTotal = () => {
    if (unitType === 'sqft' && pricePerSqft && totalArea) {
      return (parseFloat(pricePerSqft) * parseFloat(totalArea)).toFixed(2);
    } else if (unitType === 'unit' && pricePerUnit && totalUnits) {
      return (parseFloat(pricePerUnit) * parseFloat(totalUnits)).toFixed(2);
    }
    return '0.00';
  };

  const handleSave = async () => {
    if (!studioId) return;
    
    try {
      setSaving(true);
      
      const updates: any = {
        unit_type: unitType,
        last_price_update: new Date().toISOString()
      };

      // Update pricing based on unit type
      if (unitType === 'sqft' && pricePerSqft) {
        updates.price_per_sqft = parseFloat(pricePerSqft);
        updates.price_per_unit = null;
      } else if (unitType === 'unit' && pricePerUnit) {
        updates.price_per_unit = parseFloat(pricePerUnit);
        updates.price_per_sqft = null;
      }

      const { error } = await supabase
        .from('materials')
        .update(updates)
        .eq('id', material.id)
        .eq('studio_id', studioId);

      if (error) throw error;

      toast({
        title: "Pricing Updated",
        description: "Material pricing has been saved successfully",
      });

      onPricingUpdated();
      
      // Reset quantity fields after successful save
      setTotalArea('');
      setTotalUnits('');
      
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to update pricing",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    const currentPricePerSqft = material.price_per_sqft?.toString() || '';
    const currentPricePerUnit = material.price_per_unit?.toString() || '';
    const currentUnitType = material.unit_type || 'sqft';
    
    return pricePerSqft !== currentPricePerSqft || 
           pricePerUnit !== currentPricePerUnit || 
           unitType !== currentUnitType;
  };

  const totalCost = calculateTotal();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">Pricing Information</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Unit Type</label>
          <Select value={unitType} onValueChange={setUnitType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">Square Feet</SelectItem>
              <SelectItem value="unit">Units/Pieces</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {unitType === 'sqft' ? (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Price per Sq Ft</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={pricePerSqft}
                onChange={(e) => setPricePerSqft(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Total Area (sq ft)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Price per Unit</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Total Units</label>
              <Input
                type="number"
                step="1"
                placeholder="0"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Total Cost</label>
          <div className="flex items-center h-8 px-3 bg-green-50 border border-green-200 rounded text-xs font-medium text-green-700">
            <Calculator className="h-3 w-3 mr-1" />
            ${totalCost}
          </div>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges()}
            size="sm"
            className="h-8 text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {material.last_price_update && (
        <div className="text-xs text-gray-500 mt-2">
          Last updated: {new Date(material.last_price_update).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default MaterialPricingInput;
