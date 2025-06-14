
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package, Tag } from 'lucide-react';

const MaterialsByCategory = () => {
  const { category } = useParams();
  const { studioId } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category && studioId) {
      fetchMaterialsByCategory();
      fetchProjectsByCategory();
    }
  }, [category, studioId]);

  const fetchMaterialsByCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          manufacturers(name),
          proj_materials(project_id, projects(name))
        `)
        .eq('category', category)
        .eq('studio_id', studioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials by category:', error);
    }
  };

  const fetchProjectsByCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('proj_materials')
        .select(`
          *,
          projects(id, name, status, type),
          materials!inner(category)
        `)
        .eq('materials.category', category)
        .eq('studio_id', studioId);

      if (error) throw error;
      
      // Get unique projects
      const uniqueProjects = data?.reduce((acc: any[], item) => {
        if (!acc.find(p => p.projects.id === item.projects.id)) {
          acc.push(item);
        }
        return acc;
      }, []) || [];
      
      setProjects(uniqueProjects);
    } catch (error) {
      console.error('Error fetching projects by category:', error);
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

  if (loading) {
    return <div className="p-6">Loading category details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/materials">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Materials
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Category: {category}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Category Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-sm text-gray-500">Materials in this category</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-sm text-gray-500">Projects using this category</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials in {category}</CardTitle>
          <CardDescription>All materials in this category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <Package className="h-6 w-6 text-coral-600" />
                  </div>
                  <div className="flex-1">
                    <Link to={`/materials/${material.id}`} className="hover:text-coral">
                      <h3 className="font-semibold text-lg">{material.name}</h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Manufacturer: {material.manufacturers?.name || 'None'}</span>
                      <span>Used in {material.proj_materials?.length || 0} project(s)</span>
                    </div>
                    {material.notes && (
                      <p className="text-sm text-gray-600 mt-1">{material.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No materials found in this category.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects Using {category} Materials</CardTitle>
          <CardDescription>All projects that use materials from this category</CardDescription>
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
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No projects found using materials from this category.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsByCategory;
