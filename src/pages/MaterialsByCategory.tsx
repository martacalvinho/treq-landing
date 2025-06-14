
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Search, Package } from 'lucide-react';

const MaterialsByCategory = () => {
  const { category } = useParams();
  const { studioId } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const decodedCategory = decodeURIComponent(category || '');

  useEffect(() => {
    if (decodedCategory && studioId) {
      fetchMaterialsByCategory();
      fetchProjectsByCategory();
    }
  }, [decodedCategory, studioId]);

  const fetchMaterialsByCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          manufacturers(name),
          proj_materials(project_id, projects(name))
        `)
        .eq('category', decodedCategory)
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
          project_id,
          projects(id, name, type, status),
          materials!inner(category)
        `)
        .eq('materials.category', decodedCategory)
        .eq('studio_id', studioId);

      if (error) throw error;
      
      // Get unique projects
      const uniqueProjects = data?.reduce((acc: any[], current) => {
        const exists = acc.find(item => item.projects.id === current.projects.id);
        if (!exists) {
          acc.push(current);
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

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.manufacturers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading materials in {decodedCategory}...</div>;
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
        <h1 className="text-3xl font-bold text-gray-900">Category: {decodedCategory}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Category Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-sm text-gray-500">Materials in this Category</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-sm text-gray-500">Projects Using this Category</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Materials in {decodedCategory}</CardTitle>
                  <CardDescription>All materials in this category</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMaterials.map((material) => {
                  const projectCount = material.proj_materials?.length || 0;
                  return (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
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
                            <span>Used in {projectCount} project{projectCount !== 1 ? 's' : ''}</span>
                          </div>
                          {material.notes && (
                            <p className="text-sm text-gray-600 mt-1">{material.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredMaterials.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No materials found matching your search.' : `No materials in ${decodedCategory} category yet.`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projects Using {decodedCategory} Materials</CardTitle>
            <CardDescription>Projects that have used materials from this category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((projMaterial) => (
                <div key={projMaterial.projects.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <Link to={`/projects/${projMaterial.projects.id}`} className="hover:text-coral">
                      <h3 className="font-semibold text-lg">{projMaterial.projects.name}</h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Type: {projMaterial.projects.type}</span>
                      <span>Status: {projMaterial.projects.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaterialsByCategory;
