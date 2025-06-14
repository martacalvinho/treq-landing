
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building2, Package } from 'lucide-react';

const ClientDetails = () => {
  const { id } = useParams();
  const { studioId } = useAuth();
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            materials(name, category),
            projects(name)
          `)
          .in('project_id', projectIds)
          .eq('studio_id', studioId);

        if (materialsError) throw materialsError;
        setMaterials(materialsData || []);
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
      <div className="flex items-center gap-4">
        <Link to="/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Client: {client.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg">{client.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getClientStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {client.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-gray-700 mt-1">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Client Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-sm text-gray-500">Total Projects</p>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'active').length}
                </div>
                <p className="text-sm text-gray-500">Active Projects</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-sm text-gray-500">Total Materials Used</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Projects associated with this client</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-coral-600" />
                  </div>
                  <div className="flex-1">
                    <Link to={`/projects/${project.id}`} className="hover:text-coral">
                      <h3 className="font-semibold">{project.name}</h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Type: {project.type}</span>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      {project.start_date && (
                        <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
                      )}
                    </div>
                    {project.notes && (
                      <p className="text-sm text-gray-600 mt-1">{project.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No projects associated with this client yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Materials Used</CardTitle>
              <CardDescription>Materials used across all client projects</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((projMaterial) => (
              <div key={projMaterial.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <Package className="h-6 w-6 text-coral-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{projMaterial.materials?.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Category: {projMaterial.materials?.category}</span>
                      <span>Project: {projMaterial.projects?.name}</span>
                      {projMaterial.quantity && (
                        <span>Qty: {projMaterial.quantity} {projMaterial.unit || ''}</span>
                      )}
                    </div>
                    {projMaterial.notes && (
                      <p className="text-sm text-gray-600 mt-1">{projMaterial.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
