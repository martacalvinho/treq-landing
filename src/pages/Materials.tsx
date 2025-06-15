
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Search, Package, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddMaterialForm from '@/components/forms/AddMaterialForm';
import EditMaterialForm from '@/components/forms/EditMaterialForm';

const Materials = () => {
  const { studioId } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    if (studioId) {
      fetchMaterials();
      fetchProjects();
      fetchManufacturers();
      fetchClients();
    }
  }, [studioId]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          manufacturers(id, name),
          proj_materials(
            project_id, 
            projects(
              id, 
              name, 
              clients(id, name)
            )
          )
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

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('studio_id', studioId)
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, name')
        .eq('studio_id', studioId)
        .order('name');

      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('studio_id', studioId)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const filteredMaterials = materials.filter(material => {
    // Search term filter
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.reference_sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.dimensions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.manufacturers?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Project filter
    const matchesProject = !selectedProject || 
      material.proj_materials?.some(pm => pm.project_id === selectedProject);

    // Manufacturer filter
    const matchesManufacturer = !selectedManufacturer || 
      material.manufacturer_id === selectedManufacturer;

    // Client filter
    const matchesClient = !selectedClient || 
      material.proj_materials?.some(pm => pm.projects?.clients?.id === selectedClient);

    return matchesSearch && matchesProject && matchesManufacturer && matchesClient;
  });

  const clearAllFilters = () => {
    setSelectedProject('');
    setSelectedManufacturer('');
    setSelectedClient('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedProject || selectedManufacturer || selectedClient || searchTerm;

  if (loading) {
    return <div className="p-6">Loading materials...</div>;
  }

  return (
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

          {/* Filters Section */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All manufacturers</SelectItem>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedProject && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Project: {projects.find(p => p.id === selectedProject)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedProject('')}
                  />
                </Badge>
              )}
              {selectedManufacturer && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Manufacturer: {manufacturers.find(m => m.id === selectedManufacturer)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedManufacturer('')}
                  />
                </Badge>
              )}
              {selectedClient && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Client: {clients.find(c => c.id === selectedClient)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedClient('')}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMaterials.map((material) => {
              const projectCount = material.proj_materials?.length || 0;
              const projectInfo = material.proj_materials?.[0]?.projects;
              const clientInfo = projectInfo?.clients;
              
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
                        <span>Category: {material.category}</span>
                        {material.subcategory && <span>• {material.subcategory}</span>}
                        <span>• Manufacturer: {material.manufacturers?.name || 'None'}</span>
                        <span>• Used in {projectCount} project{projectCount !== 1 ? 's' : ''}</span>
                        {clientInfo && <span>• Client: {clientInfo.name}</span>}
                      </div>
                      {(material.reference_sku || material.dimensions) && (
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          {material.reference_sku && <span>SKU: {material.reference_sku}</span>}
                          {material.dimensions && <span>• Dimensions: {material.dimensions}</span>}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {material.tag && (
                          <Badge variant="secondary" className="text-xs">
                            {material.tag}
                          </Badge>
                        )}
                        {material.location && (
                          <Badge variant="outline" className="text-xs">
                            📍 {material.location}
                          </Badge>
                        )}
                      </div>
                      {material.notes && (
                        <p className="text-sm text-gray-600 mt-1">{material.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EditMaterialForm material={material} onMaterialUpdated={fetchMaterials} />
                  </div>
                </div>
              );
            })}
            {filteredMaterials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {hasActiveFilters ? 'No materials found matching your filters.' : 'No materials yet. Create your first material!'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Materials;
