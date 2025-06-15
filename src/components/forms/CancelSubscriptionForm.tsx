
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CancelSubscriptionForm = () => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, userProfile, studioId } = useAuth();
  const { toast } = useToast();

  const reasons = [
    { id: 'too_expensive', label: 'Too expensive' },
    { id: 'not_using', label: 'Not using the service enough' },
    { id: 'missing_features', label: 'Missing features I need' },
    { id: 'switching_service', label: 'Switching to another service' },
    { id: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !studioId || !reason) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('alerts')
        .insert({
          studio_id: studioId,
          message: `${userProfile?.studios?.name || 'Studio'} requests subscription cancellation. Reason: ${reasons.find(r => r.id === reason)?.label}. Additional feedback: ${additionalFeedback || 'None'}`,
          severity: 'high',
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Cancellation request submitted",
        description: "We'll contact you soon to discuss your cancellation.",
      });

      setReason('');
      setAdditionalFeedback('');
      setOpen(false);
    } catch (error) {
      console.error('Error submitting cancellation request:', error);
      toast({
        title: "Error",
        description: "Failed to submit cancellation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Cancel Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Cancel Subscription</DialogTitle>
          <DialogDescription>
            We're sorry to see you go. Please let us know why you're cancelling.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Reason for cancellation</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              {reasons.map((reasonOption) => (
                <div key={reasonOption.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reasonOption.id} id={reasonOption.id} />
                  <Label htmlFor={reasonOption.id}>{reasonOption.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="feedback">Additional Feedback (optional)</Label>
            <Textarea
              id="feedback"
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              placeholder="How could we have improved your experience?"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Keep Subscription
            </Button>
            <Button type="submit" variant="destructive" disabled={loading || !reason}>
              {loading ? "Submitting..." : "Submit Cancellation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionForm;
