
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building, Package } from 'lucide-react';

const ManufacturerDetails = () => {
  const { id } = useParams();
  const { studioId } = useAuth();
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && studioId) {
      fetchManufacturerDetails();
      fetchManufacturerMaterials();
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

  if (loading || !manufacturer) {
    return <div className="p-6">Loading manufacturer details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/manufacturers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Manufacturers
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Manufacturer: {manufacturer.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Manufacturer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Name</label>
                  <p className="text-lg">{manufacturer.contact_name || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{manufacturer.email || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-lg">{manufacturer.phone || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <p className="text-lg">{manufacturer.website || 'Not specified'}</p>
                </div>
              </div>
              {manufacturer.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-gray-700 mt-1">{manufacturer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Materials Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materials.length}</div>
              <p className="text-sm text-gray-500">Materials from this manufacturer</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials from {manufacturer.name}</CardTitle>
          <CardDescription>All materials from this manufacturer</CardDescription>
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
                      <span>Category: {material.category}</span>
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
