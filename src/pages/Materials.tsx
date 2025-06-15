import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMaterialLimits } from '@/hooks/useMaterialLimits';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Search, Package, X, Filter, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddMaterialForm from '@/components/forms/AddMaterialForm';
import EditMaterialForm from '@/components/forms/EditMaterialForm';
import ApplyToProjectForm from '@/components/forms/ApplyToProjectForm';
import PricingAnalytics from '@/components/PricingAnalytics';
import { useToast } from '@/hooks/use-toast';

const Materials = () => {
  const { studioId } = useAuth();
  const { canAddMaterial } = useMaterialLimits();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
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

  const checkForDuplicates = async () => {
    setCheckingDuplicates(true);
    try {
      // Find materials with duplicate reference_sku (excluding null/empty values)
      const materialsWithSku = materials.filter(m => m.reference_sku && m.reference_sku.trim() !== '');
      
      const duplicateGroups = new Map();
      const duplicateIds = new Set();
      
      materialsWithSku.forEach(material => {
        const sku = material.reference_sku.trim().toLowerCase();
        if (!duplicateGroups.has(sku)) {
          duplicateGroups.set(sku, []);
        }
        duplicateGroups.get(sku).push(material);
      });
      
      // Find groups with more than one material
      const duplicatesList: any[] = [];
      duplicateGroups.forEach((group, sku) => {
        if (group.length > 1) {
          group.forEach((material: any) => {
            duplicateIds.add(material.id);
            duplicatesList.push({
              ...material,
              duplicateSku: sku,
              duplicateCount: group.length
            });
          });
        }
      });
      
      setDuplicates(duplicatesList);
      
      if (duplicatesList.length > 0) {
        toast({
          title: "Duplicates Found",
          description: `Found ${duplicatesList.length} materials with duplicate reference SKUs`,
          variant: "default"
        });
        setShowDuplicatesOnly(true);
      } else {
        toast({
          title: "No Duplicates",
          description: "No duplicate reference SKUs found in your materials",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      toast({
        title: "Error",
        description: "Failed to check for duplicates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const clearDuplicateFilter = () => {
    setShowDuplicatesOnly(false);
    setDuplicates([]);
  };

  const filteredMaterials = materials.filter(material => {
    // If showing duplicates only, filter to show only duplicate materials
    if (showDuplicatesOnly) {
      const isDuplicate = duplicates.some(dup => dup.id === material.id);
      if (!isDuplicate) return false;
    }

    // Text search filter
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.reference_sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.dimensions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.manufacturers?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Project filter
    const matchesProject = !projectFilter || projectFilter === 'all' ||
      material.proj_materials?.some((pm: any) => pm.project_id === projectFilter);

    // Manufacturer filter
    const matchesManufacturer = !manufacturerFilter || manufacturerFilter === 'all' ||
      material.manufacturer_id === manufacturerFilter;

    // Client filter
    const matchesClient = !clientFilter || clientFilter === 'all' ||
      material.proj_materials?.some((pm: any) => pm.projects?.client_id === clientFilter);

    // Location filter
    const matchesLocation = !locationFilter ||
      material.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesProject && matchesManufacturer && matchesClient && matchesLocation;
  });

  const clearFilters = () => {
    setProjectFilter('');
    setManufacturerFilter('');
    setClientFilter('');
    setLocationFilter('');
  };

  const hasActiveFilters = projectFilter && projectFilter !== 'all' || 
                          manufacturerFilter && manufacturerFilter !== 'all' || 
                          clientFilter && clientFilter !== 'all' ||
                          locationFilter;

  // Helper function to parse locations
  const parseLocations = (locationString: string | null) => {
    if (!locationString) return [];
    return locationString.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0);
  };

  const handleLocationClick = (location: string) => {
    if (locationFilter === location) {
      // If already filtered by this location, clear the filter
      setLocationFilter('');
    } else {
      // Set filter to this location
      setLocationFilter(location);
    }
  };

  if (loading) {
    return <div className="p-6">Loading materials...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Materials Library</h1>
        <div className="flex items-center gap-2">
          {!canAddMaterial && (
            <p className="text-sm text-gray-500">
              Material limit reached for this month
            </p>
          )}
          <Button
            onClick={checkForDuplicates}
            disabled={checkingDuplicates || materials.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {checkingDuplicates ? 'Checking...' : 'Check for Duplicates'}
          </Button>
          <AddMaterialForm onMaterialAdded={fetchMaterials} />
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Pricing Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
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
                  {showDuplicatesOnly && (
                    <Badge variant="destructive" className="text-xs">
                      Showing {duplicates.length} duplicates
                      <button
                        onClick={clearDuplicateFilter}
                        className="ml-1 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
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
                    <Select value={projectFilter || 'all'} onValueChange={setProjectFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All projects</SelectItem>
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
                    <Select value={manufacturerFilter || 'all'} onValueChange={setManufacturerFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All manufacturers</SelectItem>
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
                    <Select value={clientFilter || 'all'} onValueChange={setClientFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All clients</SelectItem>
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
                    {projectFilter && projectFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Project: {projects.find(p => p.id === projectFilter)?.name}
                        <button
                          onClick={() => setProjectFilter('all')}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {manufacturerFilter && manufacturerFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Manufacturer: {manufacturers.find(m => m.id === manufacturerFilter)?.name}
                        <button
                          onClick={() => setManufacturerFilter('all')}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {clientFilter && clientFilter !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Client: {clients.find(c => c.id === clientFilter)?.name}
                        <button
                          onClick={() => setClientFilter('all')}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {locationFilter && (
                      <Badge variant="secondary" className="text-xs">
                        Location: {locationFilter}
                        <button
                          onClick={() => setLocationFilter('')}
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
                  const locations = parseLocations(material.location);
                  const isDuplicate = duplicates.some(dup => dup.id === material.id);
                  const duplicateInfo = duplicates.find(dup => dup.id === material.id);
                  const hasPricing = material.price_per_sqft || material.price_per_unit;
                  
                  return (
                    <div 
                      key={material.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                        isDuplicate ? 'border-red-200 bg-red-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isDuplicate ? 'bg-red-100' : 'bg-coral-100'}`}>
                          <Package className={`h-6 w-6 ${isDuplicate ? 'text-red-600' : 'text-coral-600'}`} />
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
                          
                          {/* Pricing Information */}
                          {hasPricing && (
                            <div className="flex items-center gap-2 mt-1">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              {material.price_per_sqft && (
                                <Badge variant="outline" className="text-xs text-green-700 border-green-200">
                                  ${material.price_per_sqft}/sqft
                                </Badge>
                              )}
                              {material.price_per_unit && (
                                <Badge variant="outline" className="text-xs text-green-700 border-green-200">
                                  ${material.price_per_unit}/unit
                                </Badge>
                              )}
                              {material.last_price_update && (
                                <span className="text-xs text-gray-400">
                                  Updated: {new Date(material.last_price_update).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {(material.reference_sku || material.dimensions) && (
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              {material.reference_sku && (
                                <span className={isDuplicate ? 'text-red-600 font-medium' : ''}>
                                  SKU: {material.reference_sku}
                                  {isDuplicate && (
                                    <span className="ml-1 text-red-500">
                                      (Duplicate - {duplicateInfo?.duplicateCount} total)
                                    </span>
                                  )}
                                </span>
                              )}
                              {material.dimensions && <span>• Dimensions: {material.dimensions}</span>}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {material.tag && (
                              <Badge variant="secondary" className="text-xs">
                                {material.tag}
                              </Badge>
                            )}
                            {locations.length > 0 && (
                              <div className="flex items-center gap-1">
                                {locations.map((location, index) => (
                                  <Badge 
                                    key={index} 
                                    variant={locationFilter === location ? "default" : "outline"} 
                                    className="text-xs cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleLocationClick(location)}
                                  >
                                    📍 {location}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {material.notes && (
                            <p className="text-sm text-gray-600 mt-1">{material.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApplyToProjectForm material={material} onMaterialUpdated={fetchMaterials} />
                        <EditMaterialForm material={material} onMaterialUpdated={fetchMaterials} />
                      </div>
                    </div>
                  );
                })}
                {filteredMaterials.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {showDuplicatesOnly 
                      ? 'No duplicate materials found.' 
                      : searchTerm || hasActiveFilters 
                      ? 'No materials found matching your search or filters.' 
                      : 'No materials yet. Create your first material!'
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <PricingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Materials;
