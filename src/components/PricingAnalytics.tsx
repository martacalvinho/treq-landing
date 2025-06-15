
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface PricingAnalyticsProps {
  materialId?: string;
  projectId?: string;
  manufacturerId?: string;
  clientId?: string;
}

const PricingAnalytics = ({ materialId, projectId, manufacturerId, clientId }: PricingAnalyticsProps) => {
  const { studioId } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('overview');

  useEffect(() => {
    if (studioId) {
      fetchPricingAnalytics();
      fetchPriceHistory();
    }
  }, [studioId, materialId, projectId, manufacturerId, clientId]);

  const fetchPricingAnalytics = async () => {
    try {
      let query = supabase
        .from('materials')
        .select(`
          id,
          name,
          category,
          price_per_sqft,
          price_per_unit,
          unit_type,
          last_price_update,
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
        .not('price_per_sqft', 'is', null)
        .or('price_per_unit.not.is.null');

      if (materialId) {
        query = query.eq('id', materialId);
      }
      if (manufacturerId) {
        query = query.eq('manufacturer_id', manufacturerId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Process analytics data
      const processedData = {
        totalMaterials: data?.length || 0,
        avgPricePerSqft: 0,
        avgPricePerUnit: 0,
        priceRanges: {
          sqft: { min: 0, max: 0 },
          unit: { min: 0, max: 0 }
        },
        categoriesWithPricing: new Set(),
        manufacturersWithPricing: new Set(),
        projectsWithPricing: new Set(),
      };

      if (data && data.length > 0) {
        const sqftPrices = data.filter(m => m.price_per_sqft).map(m => m.price_per_sqft);
        const unitPrices = data.filter(m => m.price_per_unit).map(m => m.price_per_unit);

        if (sqftPrices.length > 0) {
          processedData.avgPricePerSqft = sqftPrices.reduce((a, b) => a + b, 0) / sqftPrices.length;
          processedData.priceRanges.sqft.min = Math.min(...sqftPrices);
          processedData.priceRanges.sqft.max = Math.max(...sqftPrices);
        }

        if (unitPrices.length > 0) {
          processedData.avgPricePerUnit = unitPrices.reduce((a, b) => a + b, 0) / unitPrices.length;
          processedData.priceRanges.unit.min = Math.min(...unitPrices);
          processedData.priceRanges.unit.max = Math.max(...unitPrices);
        }

        data.forEach(material => {
          processedData.categoriesWithPricing.add(material.category);
          if (material.manufacturers?.name) {
            processedData.manufacturersWithPricing.add(material.manufacturers.name);
          }
          material.proj_materials?.forEach((pm: any) => {
            if (pm.projects?.name) {
              processedData.projectsWithPricing.add(pm.projects.name);
            }
          });
        });
      }

      setAnalytics(processedData);
    } catch (error) {
      console.error('Error fetching pricing analytics:', error);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      let query = supabase
        .from('material_price_history')
        .select(`
          *,
          materials(name, category)
        `)
        .eq('studio_id', studioId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (materialId) {
        query = query.eq('material_id', materialId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setPriceHistory(data || []);
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading pricing analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-4 text-gray-500">No pricing data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pricing Analytics</h2>
        <Select value={viewType} onValueChange={setViewType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="history">Price History</SelectItem>
            <SelectItem value="trends">Trends</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewType === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materials with Pricing</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalMaterials}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price/Sqft</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analytics.avgPricePerSqft.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Range: ${analytics.priceRanges.sqft.min.toFixed(2)} - ${analytics.priceRanges.sqft.max.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price/Unit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analytics.avgPricePerUnit.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Range: ${analytics.priceRanges.unit.min.toFixed(2)} - ${analytics.priceRanges.unit.max.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.categoriesWithPricing.size}</div>
              <p className="text-xs text-muted-foreground">with pricing data</p>
            </CardContent>
          </Card>
        </div>
      )}

      {viewType === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Price Change History</CardTitle>
            <CardDescription>Recent price updates for materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priceHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{entry.materials?.name}</h4>
                    <p className="text-sm text-gray-500">{entry.materials?.category}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {entry.price_per_sqft && (
                      <Badge variant="secondary" className="mb-1">
                        ${entry.price_per_sqft}/sqft
                      </Badge>
                    )}
                    {entry.price_per_unit && (
                      <Badge variant="secondary">
                        ${entry.price_per_unit}/unit
                      </Badge>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{entry.change_reason}</p>
                  </div>
                </div>
              ))}
              {priceHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No price changes recorded yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PricingAnalytics;
