
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Database, Activity, Users, DollarSign } from 'lucide-react';

const SystemHealthIndicators = () => {
  const [healthData, setHealthData] = useState({
    dbStatus: 'checking',
    totalUsers: 0,
    totalSubscriptions: 0,
    monthlyRevenue: 0,
    responseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();

      // Test database connectivity and get basic stats
      const [usersResult, studiosResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('studios').select('subscription_tier', { count: 'exact' })
      ]);

      const responseTime = Date.now() - startTime;

      // Calculate monthly revenue based on subscription tiers
      let monthlyRevenue = 0;
      if (studiosResult.data) {
        studiosResult.data.forEach(studio => {
          switch (studio.subscription_tier) {
            case 'starter':
              monthlyRevenue += 29; // Example pricing
              break;
            case 'professional':
              monthlyRevenue += 99;
              break;
            case 'enterprise':
              monthlyRevenue += 299;
              break;
          }
        });
      }

      setHealthData({
        dbStatus: usersResult.error || studiosResult.error ? 'error' : 'healthy',
        totalUsers: usersResult.count || 0,
        totalSubscriptions: studiosResult.count || 0,
        monthlyRevenue,
        responseTime
      });
    } catch (error) {
      console.error('Error checking system health:', error);
      setHealthData(prev => ({ ...prev, dbStatus: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getResponseTimeStatus = (time: number) => {
    if (time < 100) return 'healthy';
    if (time < 500) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading system status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Database</div>
              <Badge className={getStatusColor(healthData.dbStatus)}>
                {healthData.dbStatus}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Total Users</div>
              <div className="text-lg font-bold">{healthData.totalUsers}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Total Studios</div>
              <div className="text-lg font-bold">{healthData.totalSubscriptions}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium">Monthly Revenue</div>
              <div className="text-lg font-bold">${healthData.monthlyRevenue}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Response Time:</span>
            <Badge className={getStatusColor(getResponseTimeStatus(healthData.responseTime))}>
              {healthData.responseTime}ms
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthIndicators;
