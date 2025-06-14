
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FolderOpen, Package, Building, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const StudioDashboard = () => {
  const { userProfile, studioId } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalMaterials: 0,
    totalManufacturers: 0,
    totalClients: 0,
    activeAlerts: 0,
    monthlyMaterials: 0
  });
  const [recentMaterials, setRecentMaterials] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studioId) {
      fetchStudioData();
    }
  }, [studioId]);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      
      // Fetch counts
      const [projects, materials, manufacturers, clients, alerts] = await Promise.all([
        supabase.from('projects').select('id, status', { count: 'exact' }).eq('studio_id', studioId),
        supabase.from('materials').select('id', { count: 'exact', head: true }).eq('studio_id', studioId),
        supabase.from('manufacturers').select('id', { count: 'exact', head: true }).eq('studio_id', studioId),
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('studio_id', studioId),
        supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('studio_id', studioId).eq('status', 'active')
      ]);

      // Calculate active projects
      const activeProjects = projects.data?.filter(p => p.status === 'active').length || 0;

      // Fetch recent materials
      const { data: recentMaterialsData } = await supabase
        .from('materials')
        .select('*, manufacturers(name)')
        .eq('studio_id', studioId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent projects
      const { data: recentProjectsData } = await supabase
        .from('projects')
        .select('*, clients(name)')
        .eq('studio_id', studioId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate this month's materials (simplified)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const { data: monthlyMaterialsData } = await supabase
        .from('proj_materials')
        .select('id', { count: 'exact', head: true })
        .eq('studio_id', studioId)
        .gte('date_added', thisMonth.toISOString());

      setStats({
        totalProjects: projects.count || 0,
        activeProjects,
        totalMaterials: materials.count || 0,
        totalManufacturers: manufacturers.count || 0,
        totalClients: clients.count || 0,
        activeAlerts: alerts.count || 0,
        monthlyMaterials: monthlyMaterialsData?.count || 0
      });

      setRecentMaterials(recentMaterialsData || []);
      setRecentProjects(recentProjectsData || []);
    } catch (error) {
      console.error('Error fetching studio data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const subscriptionLimit = userProfile?.studios?.subscription_tier === 'starter' ? 100 : 
                           userProfile?.studios?.subscription_tier === 'professional' ? 500 : 1500;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {userProfile?.studios?.name} Dashboard
        </h1>
      </div>

      {/* Usage Overview */}
      <Card className="bg-gradient-to-r from-coral-50 to-orange-50 border-coral-200">
        <CardHeader>
          <CardTitle className="text-coral-800">Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-coral-700">
                {stats.monthlyMaterials}/{subscriptionLimit}
              </div>
              <p className="text-sm text-coral-600">Materials this month</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeProjects}</div>
              <p className="text-sm text-gray-600">Active projects</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</div>
              <p className="text-sm text-gray-600">Total materials library</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">
              In your library
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manufacturers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalManufacturers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Materials</CardTitle>
            <CardDescription>Recently added to your library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{material.name}</p>
                    <p className="text-sm text-gray-500">
                      {material.category} • {material.manufacturers?.name || 'No manufacturer'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(material.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {recentMaterials.length === 0 && (
                <p className="text-gray-500 text-center py-4">No materials yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">
                      {project.type} • {project.clients?.name || 'No client'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-700' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <p className="text-gray-500 text-center py-4">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudioDashboard;
