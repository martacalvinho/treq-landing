
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Package, X, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddMaterialForm from '@/components/forms/AddMaterialForm';
import EditMaterialForm from '@/components/forms/EditMaterialForm';

const Materials = () => {
  const { studioId } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  
  // Filter options
  const [projects, setProjects] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    if (studioId) {
      fetchMaterials();
      fetchFilterOptions();
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
          proj_materials(
            project_id, 
            projects(
              name,
              client_id,
              clients(name)
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

  const fetchFilterOptions = async () => {
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('studio_id', studioId)
        .order('name');

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch manufacturers
      const { data: manufacturersData, error: manufacturersError } = await supabase
        .from('manufacturers')
        .select('id, name')
        .eq('studio_id', studioId)
        .order('name');

      if (manufacturersError) throw manufacturersError;
      setManufacturers(manufacturersData || []);

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name')
        .eq('studio_id', studioId)
        .order('name');

      if (clientsError) throw clientsError;
      setClients(clientsData || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const filteredMaterials = materials.filter(material => {
    // Text search filter
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.reference_sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.dimensions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.manufacturers?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Project filter
    const matchesProject = !projectFilter || 
      material.proj_materials?.some((pm: any) => pm.project_id === projectFilter);

    // Manufacturer filter
    const matchesManufacturer = !manufacturerFilter || 
      material.manufacturer_id === manufacturerFilter;

    // Client filter
    const matchesClient = !clientFilter ||
      material.proj_materials?.some((pm: any) => pm.projects?.client_id === clientFilter);

    return matchesSearch && matchesProject && matchesManufacturer && matchesClient;
  });

  const clearFilters = () => {
    setProjectFilter('');
    setManufacturerFilter('');
    setClientFilter('');
  };

  const hasActiveFilters = projectFilter || manufacturerFilter || clientFilter;

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
        </CardHeader>
        <CardContent>
          {/* Filter Section */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Project Filter */}
              <div>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
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
              </div>

              {/* Manufacturer Filter */}
              <div>
                <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
                  <SelectTrigger>
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
              </div>

              {/* Client Filter */}
              <div>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger>
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
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {projectFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Project: {projects.find(p => p.id === projectFilter)?.name}
                    <button
                      onClick={() => setProjectFilter('')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {manufacturerFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Manufacturer: {manufacturers.find(m => m.id === manufacturerFilter)?.name}
                    <button
                      onClick={() => setManufacturerFilter('')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {clientFilter && (
                  <Badge variant="secondary" className="text-xs">
                    Client: {clients.find(c => c.id === clientFilter)?.name}
                    <button
                      onClick={() => setClientFilter('')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {filteredMaterials.map((material) => {
              const projectCount = material.proj_materials?.length || 0;
              const clientName = material.proj_materials?.[0]?.projects?.clients?.name;
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
                        {clientName && <span>• Client: {clientName}</span>}
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
                {searchTerm || hasActiveFilters ? 'No materials found matching your search or filters.' : 'No materials yet. Create your first material!'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Materials;
