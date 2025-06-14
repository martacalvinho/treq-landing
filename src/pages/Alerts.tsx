
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

const Alerts = () => {
  const { studioId } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studioId) {
      fetchAlerts();
    }
  }, [studioId]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          projects(name),
          materials(name)
        `)
        .eq('studio_id', studioId)
        .order('date_created', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId: string, status: 'resolved' | 'dismissed') => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status })
        .eq('id', alertId);

      if (error) throw error;
      
      // Refresh alerts
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'dismissed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status !== 'active');

  if (loading) {
    return <div className="p-6">Loading alerts...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <div className="text-sm text-gray-500">
          {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Active Alerts ({activeAlerts.length})
          </CardTitle>
          <CardDescription>Alerts requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(alert.date_created).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium mb-2">{alert.message}</p>
                    <div className="text-sm text-gray-600">
                      {alert.projects && <span>Project: {alert.projects.name}</span>}
                      {alert.materials && <span>Material: {alert.materials.name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => updateAlertStatus(alert.id, 'dismissed')}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {activeAlerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No active alerts. Everything looks good!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity ({resolvedAlerts.length})</CardTitle>
            <CardDescription>Recently resolved or dismissed alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resolvedAlerts.slice(0, 10).map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.date_created).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{alert.message}</p>
                      <div className="text-sm text-gray-500 mt-1">
                        {alert.projects && <span>Project: {alert.projects.name}</span>}
                        {alert.materials && <span>Material: {alert.materials.name}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Alerts;
