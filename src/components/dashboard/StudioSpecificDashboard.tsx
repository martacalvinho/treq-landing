
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building, FolderOpen, Package, Users } from 'lucide-react';
import Materials from '@/pages/Materials';
import Projects from '@/pages/Projects';
import Manufacturers from '@/pages/Manufacturers';
import Clients from '@/pages/Clients';

// Context provider to override studio ID for the pages
import { createContext, useContext } from 'react';

const StudioOverrideContext = createContext<string | null>(null);

export const useStudioOverride = () => {
  return useContext(StudioOverrideContext);
};

const StudioSpecificDashboard = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [studio, setStudio] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMaterials: 0,
    totalManufacturers: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    if (studioId) {
      fetchStudioData();
    }
  }, [studioId, isAdmin, navigate]);

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      
      // Fetch studio details
      const { data: studioData, error: studioError } = await supabase
        .from('studios')
        .select('*')
        .eq('id', studioId)
        .single();

      if (studioError) throw studioError;
      setStudio(studioData);

      // Fetch counts for the studio
      const [projectsResult, materialsResult, manufacturersResult, clientsResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
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
          .eq('studio_id', studioId)
      ]);

      setStats({
        totalProjects: projectsResult.count || 0,
        totalMaterials: materialsResult.count || 0,
        totalManufacturers: manufacturersResult.count || 0,
        totalClients: clientsResult.count || 0
      });

    } catch (error) {
      console.error('Error fetching studio data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading studio dashboard...</div>;
  }

  if (!studio) {
    return <div className="p-6">Studio not found.</div>;
  }

  return (
    <StudioOverrideContext.Provider value={studioId || null}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/studios')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studios
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {studio.name} Dashboard
            </h1>
            <p className="text-gray-600">Managing as Admin • {studio.subscription_tier} Plan</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materials</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMaterials}</div>
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
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="materials" className="space-y-4">
          <TabsList>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials" className="space-y-4">
            <Materials />
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <Projects />
          </TabsContent>
          
          <TabsContent value="manufacturers" className="space-y-4">
            <Manufacturers />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <Clients />
          </TabsContent>
        </Tabs>
      </div>
    </StudioOverrideContext.Provider>
  );
};

export default StudioSpecificDashboard;
