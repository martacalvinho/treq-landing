import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package } from 'lucide-react';
import ApplyToProjectForm from '@/components/forms/ApplyToProjectForm';
import EditMaterialForm from '@/components/forms/EditMaterialForm';

const MaterialDetails = () => {
  const { id } = useParams();
  const { studioId } = useAuth();
  const [material, setMaterial] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && studioId) {
      fetchMaterialDetails();
      fetchMaterialProjects();
    }
  }, [id, studioId]);

  const fetchMaterialDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*, manufacturers(name)')
        .eq('id', id)
        .eq('studio_id', studioId)
        .single();

      if (error) throw error;
      setMaterial(data);
    } catch (error) {
      console.error('Error fetching material:', error);
    }
  };

  const fetchMaterialProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('proj_materials')
        .select('*, projects(id, name, status, type)')
        .eq('material_id', id)
        .eq('studio_id', studioId);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching material projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialUpdated = () => {
    fetchMaterialDetails();
    fetchMaterialProjects();
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

  if (loading || !material) {
    return <div className="p-6">Loading material details...</div>;
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/materials">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Materials
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Material: {material.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Material Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <Link to={`/materials/category/${encodeURIComponent(material.category)}`} className="hover:text-coral">
                      <p className="text-lg hover:underline cursor-pointer">{material.category}</p>
                    </Link>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                    {material.manufacturer_id ? (
                      <Link to={`/manufacturers/${material.manufacturer_id}`} className="hover:text-coral">
                        <p className="text-lg hover:underline cursor-pointer">{material.manufacturers?.name || 'Not specified'}</p>
                      </Link>
                    ) : (
                      <p className="text-lg">Not specified</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-lg">{new Date(material.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-lg">{new Date(material.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {material.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-gray-700 mt-1">{material.notes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <EditMaterialForm material={material} onMaterialUpdated={handleMaterialUpdated} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ApplyToProjectForm 
                          material={material} 
                          onMaterialUpdated={handleMaterialUpdated}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add this material to an active project</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Usage Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-sm text-gray-500">Projects Using This Material</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects Using This Material</CardTitle>
            <CardDescription>All projects that have used this material</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((projMaterial) => (
                <div key={projMaterial.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <Link to={`/projects/${projMaterial.projects.id}`} className="hover:text-coral">
                      <h3 className="font-semibold text-lg">{projMaterial.projects.name}</h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Type: {projMaterial.projects.type}</span>
                      <Badge className={getStatusColor(projMaterial.projects.status)}>
                        {projMaterial.projects.status}
                      </Badge>
                      {projMaterial.quantity && (
                        <span>Qty: {projMaterial.quantity} {projMaterial.unit || ''}</span>
                      )}
                    </div>
                    {projMaterial.notes && (
                      <p className="text-sm text-gray-600 mt-1">{projMaterial.notes}</p>
                    )}
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  This material hasn't been used in any projects yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default MaterialDetails;
