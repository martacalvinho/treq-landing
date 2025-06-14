
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Send, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminAlerts = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [studios, setStudios] = useState<any[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Common alert templates
  const commonAlerts = [
    {
      message: "Material price update required - Please review and update pricing for recent orders",
      severity: "medium" as const
    },
    {
      message: "New manufacturer partnership available - Contact us for exclusive pricing",
      severity: "low" as const
    },
    {
      message: "Delivery delays expected due to supply chain issues - Plan accordingly",
      severity: "high" as const
    },
    {
      message: "Inventory levels running low for popular materials - Reorder recommended",
      severity: "medium" as const
    },
    {
      message: "System maintenance scheduled - Temporary service interruption expected",
      severity: "high" as const
    },
    {
      message: "New material categories added to catalog - Explore latest options",
      severity: "low" as const
    },
    {
      message: "Quality control issue detected - Some materials may require inspection",
      severity: "critical" as const
    },
    {
      message: "Seasonal pricing changes effective next month - Review project budgets",
      severity: "medium" as const
    }
  ];

  useEffect(() => {
    if (isAdmin) {
      fetchStudios();
    }
  }, [isAdmin]);

  const fetchStudios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .order('name');

      if (error) throw error;
      setStudios(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch studios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendAlert = async (alert: { message: string; severity: string }) => {
    if (!selectedStudio) {
      toast({
        title: "Error",
        description: "Please select a studio first",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('alerts')
        .insert({
          studio_id: selectedStudio,
          message: alert.message,
          severity: alert.severity,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alert sent successfully",
      });
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Error",
        description: "Failed to send alert",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Alerts</h1>
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <span className="text-sm text-gray-500">Send alerts to studios</span>
        </div>
      </div>

      {/* Studio Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Target Studio</CardTitle>
          <CardDescription>Choose which studio to send alerts to</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedStudio} onValueChange={setSelectedStudio}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a studio" />
            </SelectTrigger>
            <SelectContent>
              {studios.map((studio) => (
                <SelectItem key={studio.id} value={studio.id}>
                  {studio.name} ({studio.subscription_tier})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Common Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Common Alerts
          </CardTitle>
          <CardDescription>
            Click on any alert below to send it to the selected studio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {commonAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  !selectedStudio ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => selectedStudio && sendAlert(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{alert.message}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!selectedStudio}
                    onClick={(e) => {
                      e.stopPropagation();
                      sendAlert(alert);
                    }}
                    className="ml-4"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">How to use:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select a target studio from the dropdown above</li>
              <li>Click on any common alert or use the "Send" button</li>
              <li>The alert will be immediately visible in that studio's alerts page</li>
              <li>Studio users can resolve or dismiss alerts as needed</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAlerts;
