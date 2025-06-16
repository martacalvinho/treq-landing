
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building, Package, Calendar, Clock, FileText, TrendingUp } from 'lucide-react';
import AddManufacturerNoteForm from '@/components/forms/AddManufacturerNoteForm';
import PricingAnalytics from '@/components/PricingAnalytics';

const ManufacturerDetails = () => {
  const { id } = useParams();
  const { studioId } = useAuth();
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

  useEffect(() => {
    if (id && studioId) {
      fetchManufacturerDetails();
      fetchManufacturerMaterials();
      fetchProjectsCount();
      fetchManufacturerNotes();
    }
  }, [id, studioId]);

  const fetchManufacturerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('id', id)
        .eq('studio_id', studioId)
        .single();

      if (error) throw error;
      setManufacturer(data);
    } catch (error) {
      console.error('Error fetching manufacturer:', error);
    }
  };

  const fetchManufacturerMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          proj_materials(project_id, projects(name, status))
        `)
        .eq('manufacturer_id', id)
        .eq('studio_id', studioId);

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching manufacturer materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManufacturerNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturer_notes' as any)
        .select(`
          *,
          materials(id, name)
        `)
        .eq('manufacturer_id', id)
        .eq('studio_id', studioId)
        .order('contact_date', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching manufacturer notes:', error);
    }
  };

  const fetchProjectsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('proj_materials')
        .select(`
          project_id,
          materials!inner(manufacturer_id)
        `)
        .eq('materials.manufacturer_id', id)
        .eq('studio_id', studioId);

      if (error) throw error;
      
      // Get unique project IDs
      const uniqueProjectIds = new Set(data?.map(item => item.project_id) || []);
      setProjectsCount(uniqueProjectIds.size);
    } catch (error) {
      console.error('Error fetching projects count:', error);
    }
  };

  if (loading || !manufacturer) {
    return <div className="p-6">Loading manufacturer details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/manufacturers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Manufacturers
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturer: {manufacturer.name}</h1>
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
          type="manufacturer" 
          entityId={id!} 
          entityName={manufacturer.name}
          onClose={() => setShowAdvancedAnalytics(false)}
        />
      )}

      {/* Compact Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-sm text-gray-500">Materials</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{projectsCount}</div>
            <p className="text-sm text-gray-500">Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-sm text-gray-500">Notes</p>
          </CardContent>
        </Card>
      </div>

      {/* Manufacturer Details - More Compact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Manufacturer Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Contact Name</label>
              <p className="text-sm font-semibold">{manufacturer.contact_name || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Email</label>
              <p className="text-sm">{manufacturer.email || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Phone</label>
              <p className="text-sm">{manufacturer.phone || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Website</label>
              <p className="text-sm">{manufacturer.website || 'Not specified'}</p>
            </div>
            {manufacturer.notes && (
              <div className="md:col-span-2 lg:col-span-4">
                <label className="text-xs font-medium text-gray-500">Notes</label>
                <p className="text-sm text-gray-700 mt-1">{manufacturer.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Communication Notes - More Compact */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Communication Notes
              </CardTitle>
              <CardDescription>Track communications and material inquiries</CardDescription>
            </div>
            <AddManufacturerNoteForm 
              manufacturerId={id!} 
              materials={materials}
              onNoteAdded={fetchManufacturerNotes}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(note.contact_date).toLocaleDateString()}</span>
                  </div>
                  {note.delivery_time && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{note.delivery_time}</span>
                    </div>
                  )}
                </div>
                
                {note.materials && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-700">Material: </span>
                    <Link to={`/materials/${note.materials.id}`} className="text-coral hover:underline text-xs">
                      {note.materials.name}
                    </Link>
                  </div>
                )}
                
                <p className="text-gray-700 text-sm">{note.notes}</p>
              </div>
            ))}
            
            {notes.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                No communication notes yet. Add your first note to track interactions.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Materials from Manufacturer - More Compact */}
      <Card>
        <CardHeader>
          <CardTitle>Materials from {manufacturer.name}</CardTitle>
          <CardDescription>All materials from this manufacturer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <Package className="h-5 w-5 text-coral-600" />
                  </div>
                  <div className="flex-1">
                    <Link to={`/materials/${material.id}`} className="hover:text-coral">
                      <h3 className="font-semibold">{material.name}</h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{material.category}</span>
                      <span>Used in {material.proj_materials?.length || 0} project(s)</span>
                      {material.price_per_sqft && (
                        <span className="text-green-600 font-medium">${material.price_per_sqft}/sqft</span>
                      )}
                      {material.price_per_unit && (
                        <span className="text-green-600 font-medium">${material.price_per_unit}/unit</span>
                      )}
                    </div>
                    {material.notes && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{material.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No materials found from this manufacturer.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerDetails;
