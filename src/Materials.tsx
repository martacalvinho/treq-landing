
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Search, Package, Settings } from 'lucide-react';
import AddMaterialForm from '@/components/forms/AddMaterialForm';
import EditMaterialForm from '@/components/forms/EditMaterialForm';
import ApplyToProjectForm from '@/components/forms/ApplyToProjectForm';
import MaterialPricingInput from '@/components/MaterialPricingInput';
import { Link } from 'react-router-dom';

const Materials = () => {
  const { studioId } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (studioId) {
      fetchMaterials();
    }
  }, [studioId]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          manufacturers(name),
          proj_materials(project_id, projects(name))
        `)
        .eq('studio_id', studioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.manufacturers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading materials...</div>;
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Materials Library</h1>
          <AddMaterialForm onMaterialAdded={fetchMaterials} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Materials</CardTitle>
                <CardDescription>Manage your materials library</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showAdvanced ? "default" : "outline"}
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      size="sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enable advanced pricing and quantity tracking</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMaterials.map((material) => {
                const projectCount = material.proj_materials?.length || 0;
                return (
                  <div key={material.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-coral-100 rounded-lg">
                          <Package className="h-6 w-6 text-coral-600" />
                        </div>
                        <div className="flex-1">
                          <Link to={`/materials/${material.id}`} className="hover:text-coral">
                            <h3 className="font-semibold text-lg">{material.name}</h3>
                          </Link>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>Category: {material.category}</span>
                            <span>Manufacturer: {material.manufacturers?.name || 'None'}</span>
                            <span>Used in {projectCount} project{projectCount !== 1 ? 's' : ''}</span>
                            {material.price_per_sqft && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                ${material.price_per_sqft}/sqft
                              </span>
                            )}
                            {material.price_per_unit && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                ${material.price_per_unit}/unit
                              </span>
                            )}
                          </div>
                          {material.notes && (
                            <p className="text-sm text-gray-600 mt-1">{material.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <EditMaterialForm material={material} onMaterialUpdated={fetchMaterials} />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <ApplyToProjectForm material={material} onMaterialUpdated={fetchMaterials} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add this material to an active project</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    {showAdvanced && (
                      <MaterialPricingInput 
                        material={material} 
                        onPricingUpdated={fetchMaterials}
                      />
                    )}
                  </div>
                );
              })}
              {filteredMaterials.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No materials found matching your search.' : 'No materials yet. Create your first material!'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Materials;
