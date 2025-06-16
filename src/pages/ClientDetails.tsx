
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building2, Package, TrendingUp } from 'lucide-react';
import PricingAnalytics from '@/components/PricingAnalytics';

const ClientDetails = () => {
  const { id } = useParams();
  const { studioId } = useAuth();
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [totalMaterialsCount, setTotalMaterialsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

  useEffect(() => {
    if (id && studioId) {
      fetchClientDetails();
    }
  }, [id, studioId]);

  const fetchClientDetails = async () => {
    try {
      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .eq('studio_id', studioId)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Fetch client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', id)
        .eq('studio_id', studioId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch materials used in client's projects
      if (projectsData && projectsData.length > 0) {
        const projectIds = projectsData.map(p => p.id);
        const { data: materialsData, error: materialsError } = await supabase
          .from('proj_materials')
          .select(`
            *,
            materials(id, name, category),
            projects(name)
          `)
          .in('project_id', projectIds)
          .eq('studio_id', studioId);

        if (materialsError) throw materialsError;
        setMaterials(materialsData || []);
        setTotalMaterialsCount(materialsData?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'on_hold': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'prospect': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading || !client) {
    return <div className="p-6">Loading client details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Client Details</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Pricing Analytics
        </Button>
      </div>

      {/* Pricing Analytics */}
      {showAdvancedAnalytics && (
        <PricingAnalytics 
          type="client" 
          entityId={id!} 
          entityName={client.name}
          onClose={() => setShowAdvancedAnalytics(false)}
        />
      )}

      {/* Compact Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-sm text-gray-500">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <p className="text-sm text-gray-500">Active Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{totalMaterialsCount}</div>
            <p className="text-sm text-gray-500">Materials Used</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Badge className={getClientStatusColor(client.status)}>
              {client.status}
            </Badge>
            <p className="text-sm text-gray-500 mt-1">Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{client.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge className={getClientStatusColor(client.status)}>
                  {client.status}
                </Badge>
              </div>
            </div>
            {client.notes && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-700 mt-1">{client.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({projects.length})</CardTitle>
          <CardDescription>Projects associated with this client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="block">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-coral-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-coral-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{project.type}</span>
                        {project.start_date && (
                          <span>• Start: {new Date(project.start_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </Link>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No projects associated with this client yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Materials Used */}
      <Card>
        <CardHeader>
          <CardTitle>Materials Used ({totalMaterialsCount})</CardTitle>
          <CardDescription>Materials used across all client projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {materials.slice(0, 10).map((projMaterial) => (
              <Link key={projMaterial.id} to={`/materials/${projMaterial.materials?.id}`} className="block">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-coral-100 rounded-lg">
                      <Package className="h-5 w-5 text-coral-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{projMaterial.materials?.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{projMaterial.materials?.category}</span>
                        <span>• {projMaterial.projects?.name}</span>
                        {projMaterial.quantity && (
                          <span>• Qty: {projMaterial.quantity} {projMaterial.unit || ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {materials.length > 10 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Showing 10 of {totalMaterialsCount} materials. View individual projects for complete lists.
                </p>
              </div>
            )}
            {materials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No materials used in this client's projects yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetails;
