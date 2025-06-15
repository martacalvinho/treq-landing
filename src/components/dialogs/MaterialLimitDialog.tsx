
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMaterialLimits } from '@/hooks/useMaterialLimits';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MaterialLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const MaterialLimitDialog = ({ open, onOpenChange, onConfirm }: MaterialLimitDialogProps) => {
  const [choice, setChoice] = useState<'upgrade' | 'per_material' | ''>('');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [loading, setLoading] = useState(false);
  const { updateBillingPreference, monthlyLimit } = useMaterialLimits();
  const { userProfile, studioId } = useAuth();
  const { toast } = useToast();

  const plans = [
    { id: 'professional', name: 'Professional', limit: '500 materials/month' },
    { id: 'enterprise', name: 'Enterprise', limit: '1500 materials/month + premium features' }
  ];

  const currentTier = userProfile?.studios?.subscription_tier;

  const handleConfirm = async () => {
    if (!choice) return;

    setLoading(true);
    try {
      if (choice === 'upgrade') {
        // Submit upgrade request as alert
        await supabase
          .from('alerts')
          .insert({
            studio_id: studioId,
            message: `${userProfile?.studios?.name || 'Studio'} requests upgrade to ${selectedPlan} plan due to material limit reached.`,
            severity: 'high',
            status: 'active'
          });

        await updateBillingPreference('upgrade_pending');
      } else if (choice === 'per_material') {
        await updateBillingPreference('per_material');
      }

      onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing choice:', error);
      toast({
        title: "Error",
        description: "Failed to process your selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Monthly Material Limit Reached</DialogTitle>
          <DialogDescription>
            You've reached your monthly limit of {monthlyLimit} materials. 
            Choose how you'd like to proceed:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <RadioGroup value={choice} onValueChange={(value) => setChoice(value as 'upgrade' | 'per_material')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upgrade" id="upgrade" />
              <Label htmlFor="upgrade" className="flex-1">
                <div className="font-medium">Upgrade Plan</div>
                <div className="text-sm text-gray-500">Submit request to upgrade your subscription</div>
              </Label>
            </div>
            
            {choice === 'upgrade' && (
              <div className="ml-6 space-y-2">
                <Label>Select Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem 
                        key={plan.id} 
                        value={plan.id}
                        disabled={plan.id === currentTier}
                      >
                        {plan.name} - {plan.limit}
                        {plan.id === currentTier && ' (Current)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="per_material" id="per_material" />
              <Label htmlFor="per_material" className="flex-1">
                <div className="font-medium">Pay Per Extra Material</div>
                <div className="text-sm text-gray-500">$5 per material above your monthly limit</div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!choice || loading}
              className="flex-1"
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialLimitDialog;
