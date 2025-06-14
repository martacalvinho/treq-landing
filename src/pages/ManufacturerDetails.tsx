
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building, Mail, Phone, Globe, Package } from 'lucide-react';

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
        .select('id, name, category, created_at')
        .eq('manufacturer_id', id)
        .eq('studio_id', studioId)
        .order('created_at', { ascending: false });

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
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-lg">{new Date(manufacturer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                {manufacturer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${manufacturer.email}`} className="text-coral hover:text-coral-600">
                      {manufacturer.email}
                    </a>
                  </div>
                )}
                {manufacturer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${manufacturer.phone}`} className="text-coral hover:text-coral-600">
                      {manufacturer.phone}
                    </a>
                  </div>
                )}
                {manufacturer.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={manufacturer.website} target="_blank" rel="noopener noreferrer" className="text-coral hover:text-coral-600">
                      {manufacturer.website}
                    </a>
                  </div>
                )}
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
              <CardTitle>Material Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-sm text-gray-500">Materials from this Manufacturer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials from this Manufacturer</CardTitle>
          <CardDescription>All materials sourced from {manufacturer.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <Package className="h-5 w-5 text-coral-600" />
                  </div>
                  <div className="flex-1">
                    <Link to={`/materials/${material.id}`} className="hover:text-coral">
                      <h3 className="font-semibold text-lg">{material.name}</h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Category: {material.category}</span>
                      <span>Added: {new Date(material.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No materials from this manufacturer yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerDetails;
