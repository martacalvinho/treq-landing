import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Edit, Plus } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { studioId } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && studioId) {
      fetchProjectDetails();
      fetchProjectMaterials();
    }
  }, [id, studioId]);

  const fetchProjectDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(name)')
        .eq('id', id)
        .eq('studio_id', studioId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchProjectMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('proj_materials')
        .select('*, materials(name, category)')
        .eq('project_id', id)
        .eq('studio_id', studioId);

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching project materials:', error);
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

  if (loading || !project) {
    return <div className="p-6">Loading project details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Project: {project.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-lg capitalize">{project.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Client</label>
                  {project.clients && project.client_id ? (
                    <Link to={`/clients/${project.client_id}`} className="text-lg text-coral hover:text-coral-600 hover:underline">
                      {project.clients.name}
                    </Link>
                  ) : (
                    <p className="text-lg">No client assigned</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-lg">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
              {project.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-gray-700 mt-1">{project.notes}</p>
                </div>
              )}
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-sm text-gray-500">Materials Used</p>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {project.end_date && project.start_date 
                    ? Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))
                    : '-'}
                </div>
                <p className="text-sm text-gray-500">Duration (days)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Materials Used</CardTitle>
              <CardDescription>Materials assigned to this project</CardDescription>
            </div>
            <Button className="bg-coral hover:bg-coral-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((projMaterial) => (
              <div key={projMaterial.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <Link to={`/materials/${projMaterial.materials.id}`} className="hover:text-coral">
                    <h3 className="font-semibold">{projMaterial.materials?.name}</h3>
                  </Link>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>Category: {projMaterial.materials?.category}</span>
                    {projMaterial.quantity && (
                      <span>Qty: {projMaterial.quantity} {projMaterial.unit || ''}</span>
                    )}
                    {projMaterial.location && (
                      <span>Location: {projMaterial.location}</span>
                    )}
                  </div>
                  {projMaterial.notes && (
                    <p className="text-sm text-gray-600 mt-1">{projMaterial.notes}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No materials assigned to this project yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
