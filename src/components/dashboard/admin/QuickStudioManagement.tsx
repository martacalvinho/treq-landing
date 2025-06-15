
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus, Settings, Crown } from 'lucide-react';

const QuickStudioManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subscription_tier: 'starter'
  });
  const { toast } = useToast();

  const handleCreateStudio = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Studio name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('studios')
        .insert([{
          name: formData.name,
          subscription_tier: formData.subscription_tier as any
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Studio created successfully"
      });

      setFormData({ name: '', subscription_tier: 'starter' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating studio:', error);
      toast({
        title: "Error",
        description: "Failed to create studio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return { color: 'bg-purple-100 text-purple-700', icon: Crown, limit: 'Unlimited' };
      case 'professional':
        return { color: 'bg-blue-100 text-blue-700', icon: Settings, limit: '1000/month' };
      default:
        return { color: 'bg-green-100 text-green-700', icon: Building, limit: '100/month' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Quick Studio Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Studio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Studio</DialogTitle>
                  <DialogDescription>
                    Create a new studio with subscription settings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="studio-name">Studio Name</Label>
                    <Input
                      id="studio-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter studio name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subscription-tier">Subscription Tier</Label>
                    <Select 
                      value={formData.subscription_tier} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_tier: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateStudio} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Creating...' : 'Create Studio'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>

            <Button variant="outline" className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              Manage Subscriptions
            </Button>
          </div>

          {/* Subscription Tier Overview */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Subscription Tiers</h4>
            {['starter', 'professional', 'enterprise'].map((tier) => {
              const tierInfo = getTierInfo(tier);
              const Icon = tierInfo.icon;
              
              return (
                <div key={tier} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <div>
                      <Badge className={tierInfo.color}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Materials: {tierInfo.limit}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStudioManagement;
