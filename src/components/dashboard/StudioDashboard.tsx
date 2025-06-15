import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMaterialLimits } from '@/hooks/useMaterialLimits';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { FolderOpen, Package, Building, Users, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddProjectForm from '@/components/forms/AddProjectForm';
import AddMaterialForm from '@/components/forms/AddMaterialForm';
import AddClientForm from '@/components/forms/AddClientForm';
import AddManufacturerForm from '@/components/forms/AddManufacturerForm';

const StudioDashboard = () => {
  const { userProfile, studioId } = useAuth();
  const { monthlyCount, monthlyLimit, billingPreference } = useMaterialLimits();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalMaterials: 0,
    totalManufacturers: 0,
    totalClients: 0,
    activeAlerts: 0
  });
  const [recentMaterials, setRecentMaterials] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [topMaterials, setTopMaterials] = useState<any[]>([]);
  const [topManufacturers, setTopManufacturers] = useState<any[]>([]);
  const [topProject, setTopProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studioId) {
      fetchStudioData();
    }
  }, [studioId]);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      
      // Fetch counts - using count: 'exact' and head: true for count-only queries
      const [projectsResult, materialsResult, manufacturersResult, clientsResult, alertsResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id, status', { count: 'exact' })
          .eq('studio_id', studioId),
        supabase
          .from('materials')
          .select('id', { count: 'exact', head: true })
          .eq('studio_id', studioId),
        supabase
          .from('manufacturers')
          .select('id', { count: 'exact', head: true })
          .eq('studio_id', studioId),
        supabase
          .from('clients')
          .select('id', { count: 'exact', head: true })
          .eq('studio_id', studioId),
        supabase
          .from('alerts')
          .select('id', { count: 'exact', head: true })
          .eq('studio_id', studioId)
          .eq('status', 'active')
      ]);

      // Calculate active projects from the actual data
      const activeProjects = projectsResult.data?.filter(p => p.status === 'active').length || 0;

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

      // Fetch top 5 materials used
      const { data: topMaterialsData } = await supabase
        .from('proj_materials')
        .select(`
          material_id,
          materials(name, category),
          count:id
        `)
        .eq('studio_id', studioId)
        .order('count', { ascending: false })
        .limit(5);

      // Process top materials to get usage count
      const materialUsageMap = new Map();
      const { data: allProjMaterials } = await supabase
        .from('proj_materials')
        .select('material_id, materials(name, category)')
        .eq('studio_id', studioId);

      allProjMaterials?.forEach(pm => {
        if (pm.materials) {
          const count = materialUsageMap.get(pm.material_id) || 0;
          materialUsageMap.set(pm.material_id, count + 1);
        }
      });

      const topMaterialsProcessed = Array.from(materialUsageMap.entries())
        .map(([materialId, count]) => {
          const material = allProjMaterials?.find(pm => pm.material_id === materialId)?.materials;
          return { material, count, materialId };
        })
        .filter(item => item.material)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Fetch top 5 manufacturers by material count
      const { data: manufacturerMaterials } = await supabase
        .from('materials')
        .select('manufacturer_id, manufacturers(name)')
        .eq('studio_id', studioId)
        .not('manufacturer_id', 'is', null);

      const manufacturerMap = new Map();
      manufacturerMaterials?.forEach(m => {
        if (m.manufacturers) {
          const count = manufacturerMap.get(m.manufacturer_id) || 0;
          manufacturerMap.set(m.manufacturer_id, count + 1);
        }
      });

      const topManufacturersProcessed = Array.from(manufacturerMap.entries())
        .map(([manufacturerId, count]) => {
          const manufacturer = manufacturerMaterials?.find(m => m.manufacturer_id === manufacturerId)?.manufacturers;
          return { manufacturer, count, manufacturerId };
        })
        .filter(item => item.manufacturer)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Fetch project with most materials
      const { data: projectMaterialCounts } = await supabase
        .from('proj_materials')
        .select('project_id, projects(name)')
        .eq('studio_id', studioId);

      const projectMap = new Map();
      projectMaterialCounts?.forEach(pm => {
        if (pm.projects) {
          const count = projectMap.get(pm.project_id) || 0;
          projectMap.set(pm.project_id, count + 1);
        }
      });

      const topProjectData = Array.from(projectMap.entries())
        .map(([projectId, count]) => {
          const project = projectMaterialCounts?.find(pm => pm.project_id === projectId)?.projects;
          return { project, count, projectId };
        })
        .filter(item => item.project)
        .sort((a, b) => b.count - a.count)[0] || null;

      setStats({
        totalProjects: projectsResult.count || 0,
        activeProjects,
        totalMaterials: materialsResult.count || 0,
        totalManufacturers: manufacturersResult.count || 0,
        totalClients: clientsResult.count || 0,
        activeAlerts: alertsResult.count || 0
      });

      setRecentMaterials(recentMaterialsData || []);
      setRecentProjects(recentProjectsData || []);
      setTopMaterials(topMaterialsProcessed);
      setTopManufacturers(topManufacturersProcessed);
      setTopProject(topProjectData);
    } catch (error) {
      console.error('Error fetching studio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdated = () => {
    fetchStudioData();
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const getUsageColor = () => {
    const percentage = (monthlyCount / monthlyLimit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-coral-600';
  };

  const getBillingStatusText = () => {
    switch (billingPreference) {
      case 'per_material':
        return 'Per-material billing enabled';
      case 'upgrade_pending':
        return 'Upgrade request pending';
      case 'blocked':
      default:
        return 'Materials blocked at limit';
    }
  };

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
              <div className={`text-2xl font-bold ${getUsageColor()}`}>
                {monthlyCount}/{monthlyLimit}
              </div>
              <p className="text-sm text-coral-600">Materials this month</p>
              {monthlyCount >= monthlyLimit && (
                <p className="text-xs text-gray-600 mt-1">{getBillingStatusText()}</p>
              )}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Fast access to common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AddProjectForm onProjectAdded={handleDataUpdated} />
            <AddMaterialForm onMaterialAdded={handleDataUpdated} />
            <AddClientForm onClientAdded={handleDataUpdated} />
            <AddManufacturerForm onManufacturerAdded={handleDataUpdated} />
          </div>
        </CardContent>
      </Card>

      {/* Clickable Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/projects">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
        </Link>
        
        <Link to="/materials">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
        </Link>
        
        <Link to="/manufacturers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manufacturers</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalManufacturers}</div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/alerts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Materials Used</CardTitle>
            <CardDescription>Most frequently used materials in projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMaterials.map((item, index) => (
                <Link key={item.materialId} to={`/materials/${item.materialId}`}>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <div>
                      <p className="font-medium text-sm">{item.material.name}</p>
                      <p className="text-xs text-gray-500">{item.material.category}</p>
                    </div>
                    <span className="text-sm font-bold text-coral-600">{item.count} uses</span>
                  </div>
                </Link>
              ))}
              {topMaterials.length === 0 && (
                <p className="text-gray-500 text-center py-4 text-sm">No material usage data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Manufacturers</CardTitle>
            <CardDescription>Manufacturers with most materials in your library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topManufacturers.map((item, index) => (
                <Link key={item.manufacturerId} to={`/manufacturers/${item.manufacturerId}`}>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <div>
                      <p className="font-medium text-sm">{item.manufacturer.name}</p>
                    </div>
                    <span className="text-sm font-bold text-coral-600">{item.count} materials</span>
                  </div>
                </Link>
              ))}
              {topManufacturers.length === 0 && (
                <p className="text-gray-500 text-center py-4 text-sm">No manufacturer data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project with Most Materials</CardTitle>
            <CardDescription>Project using the highest number of materials</CardDescription>
          </CardHeader>
          <CardContent>
            {topProject ? (
              <Link to={`/projects/${topProject.projectId}`}>
                <div className="p-4 bg-coral-50 rounded-lg hover:bg-coral-100 cursor-pointer transition-colors">
                  <h3 className="font-semibold text-lg text-coral-800">{topProject.project.name}</h3>
                  <p className="text-coral-600 text-sm mt-1">{topProject.count} materials used</p>
                </div>
              </Link>
            ) : (
              <p className="text-gray-500 text-center py-4">No project data yet</p>
            )}
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
                <Link key={material.id} to={`/materials/${material.id}`}>
                  <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer">
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
                </Link>
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
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer">
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
                </Link>
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
