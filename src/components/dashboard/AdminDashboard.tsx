
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Users, FolderOpen, Package, AlertTriangle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SystemHealthIndicators from './admin/SystemHealthIndicators';
import UsageAnalytics from './admin/UsageAnalytics';
import RecentUserActivity from './admin/RecentUserActivity';
import QuickStudioManagement from './admin/QuickStudioManagement';
import PlatformAnnouncements from './admin/PlatformAnnouncements';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [studios, setStudios] = useState<any[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<string>('');
  const [globalStats, setGlobalStats] = useState({
    totalStudios: 0,
    totalProjects: 0,
    totalMaterials: 0,
    activeAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchGlobalData();
    }
  }, [isAdmin]);

  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      
      // Fetch studios
      const { data: studiosData } = await supabase
        .from('studios')
        .select('*')
        .order('name');
      
      // Fetch global stats
      const [projectsCount, materialsCount, alertsCount] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('materials').select('id', { count: 'exact', head: true }),
        supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      setStudios(studiosData || []);
      setGlobalStats({
        totalStudios: studiosData?.length || 0,
        totalProjects: projectsCount.count || 0,
        totalMaterials: materialsCount.count || 0,
        activeAlerts: alertsCount.count || 0
      });
    } catch (error) {
      console.error('Error fetching global data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudioDashboard = () => {
    if (selectedStudio) {
      navigate(`/studios/${selectedStudio}/dashboard`);
    }
  };

  const handleManageUsers = (studioId: string) => {
    navigate(`/users?studio=${studioId}`);
  };

  const handleViewData = (studioId: string) => {
    navigate(`/studios/${studioId}/dashboard`);
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading admin dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects, clients, materials..."
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* System Health */}
      <SystemHealthIndicators />

      {/* Global Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Studios</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.totalStudios}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.totalProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.totalMaterials}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{globalStats.activeAlerts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <UsageAnalytics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent User Activity */}
        <RecentUserActivity />

        {/* Quick Studio Management */}
        <QuickStudioManagement />
      </div>

      {/* Platform Announcements */}
      <PlatformAnnouncements />

      {/* Studio Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Studio Management</CardTitle>
          <CardDescription>Select a studio to view and manage their data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
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
            <Button 
              disabled={!selectedStudio}
              onClick={handleViewStudioDashboard}
            >
              View Studio Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Studios List */}
      <Card>
        <CardHeader>
          <CardTitle>All Studios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studios.map((studio) => (
              <div key={studio.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{studio.name}</h3>
                  <p className="text-sm text-gray-500">
                    Plan: {studio.subscription_tier} • Created: {new Date(studio.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageUsers(studio.id)}
                  >
                    Manage Users
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewData(studio.id)}
                  >
                    View Data
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
