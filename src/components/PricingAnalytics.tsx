
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, TrendingDown, Calculator } from 'lucide-react';

interface PricingAnalyticsProps {
  type: 'manufacturer' | 'client' | 'project';
  entityId: string;
  entityName: string;
}

interface PricingData {
  averagePrice: number;
  totalMaterials: number;
  totalSpend: number;
  pricePerSqft: number;
  categoryBreakdown: Array<{
    category: string;
    averagePrice: number;
    totalSpend: number;
    materialCount: number;
  }>;
  recentPriceChanges: Array<{
    materialName: string;
    oldPrice: number;
    newPrice: number;
    changeDate: string;
    changePercent: number;
  }>;
}

const PricingAnalytics = ({ type, entityId, entityName }: PricingAnalyticsProps) => {
  const { studioId } = useAuth();
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (entityId && studioId) {
      fetchPricingData();
    }
  }, [entityId, studioId, type]);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      let pricingInsights: PricingData = {
        averagePrice: 0,
        totalMaterials: 0,
        totalSpend: 0,
        pricePerSqft: 0,
        categoryBreakdown: [],
        recentPriceChanges: []
      };

      if (type === 'manufacturer') {
        pricingInsights = await fetchManufacturerPricing();
      } else if (type === 'client') {
        pricingInsights = await fetchClientPricing();
      } else if (type === 'project') {
        pricingInsights = await fetchProjectPricing();
      }

      setPricingData(pricingInsights);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManufacturerPricing = async (): Promise<PricingData> => {
    // Fetch materials from this manufacturer with pricing
    const { data: materials, error } = await supabase
      .from('materials')
      .select(`
        id, name, category, price_per_sqft, price_per_unit, unit_type,
        proj_materials(quantity, cost_per_sqft, cost_per_unit, total_cost)
      `)
      .eq('manufacturer_id', entityId)
      .eq('studio_id', studioId);

    if (error) throw error;

    const materialsWithPricing = materials?.filter(m => 
      m.price_per_sqft || m.price_per_unit
    ) || [];

    // Calculate averages and totals
    const totalMaterials = materialsWithPricing.length;
    let totalPrice = 0;
    let totalSpend = 0;
    const categoryMap = new Map();

    materialsWithPricing.forEach(material => {
      const price = material.unit_type === 'sqft' ? material.price_per_sqft : material.price_per_unit;
      if (price) {
        totalPrice += price;
        
        // Calculate spend from project materials
        const materialSpend = material.proj_materials?.reduce((sum: number, pm: any) => 
          sum + (pm.total_cost || 0), 0
        ) || 0;
        totalSpend += materialSpend;

        // Category breakdown
        if (!categoryMap.has(material.category)) {
          categoryMap.set(material.category, {
            category: material.category,
            totalPrice: 0,
            totalSpend: 0,
            count: 0
          });
        }
        const categoryData = categoryMap.get(material.category);
        categoryData.totalPrice += price;
        categoryData.totalSpend += materialSpend;
        categoryData.count += 1;
      }
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map(cat => ({
      category: cat.category,
      averagePrice: cat.count > 0 ? cat.totalPrice / cat.count : 0,
      totalSpend: cat.totalSpend,
      materialCount: cat.count
    }));

    // Fetch recent price changes
    const { data: priceHistory } = await supabase
      .from('material_price_history')
      .select(`
        *, 
        materials(name, manufacturer_id)
      `)
      .eq('studio_id', studioId)
      .eq('materials.manufacturer_id', entityId)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentPriceChanges = priceHistory?.map(change => ({
      materialName: change.materials?.name || 'Unknown',
      oldPrice: 0, // Would need to calculate from previous record
      newPrice: change.unit_type === 'sqft' ? change.price_per_sqft : change.price_per_unit,
      changeDate: change.created_at,
      changePercent: 0 // Would need previous price to calculate
    })) || [];

    return {
      averagePrice: totalMaterials > 0 ? totalPrice / totalMaterials : 0,
      totalMaterials,
      totalSpend,
      pricePerSqft: 0, // Not applicable for manufacturer view
      categoryBreakdown,
      recentPriceChanges
    };
  };

  const fetchClientPricing = async (): Promise<PricingData> => {
    // Fetch projects for this client with material costs
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id, name,
        proj_materials(
          quantity, cost_per_sqft, cost_per_unit, total_cost, square_feet,
          materials(category, price_per_sqft, price_per_unit, unit_type)
        )
      `)
      .eq('client_id', entityId)
      .eq('studio_id', studioId);

    if (error) throw error;

    let totalSpend = 0;
    let totalMaterials = 0;
    let totalSqft = 0;
    const categoryMap = new Map();

    projects?.forEach(project => {
      project.proj_materials?.forEach((pm: any) => {
        const cost = pm.total_cost || 0;
        totalSpend += cost;
        totalMaterials += 1;
        totalSqft += pm.square_feet || 0;

        const category = pm.materials?.category || 'Unknown';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            totalSpend: 0,
            materialCount: 0,
            averagePrice: 0
          });
        }
        const categoryData = categoryMap.get(category);
        categoryData.totalSpend += cost;
        categoryData.materialCount += 1;
      });
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map(cat => ({
      ...cat,
      averagePrice: cat.materialCount > 0 ? cat.totalSpend / cat.materialCount : 0
    }));

    return {
      averagePrice: totalMaterials > 0 ? totalSpend / totalMaterials : 0,
      totalMaterials,
      totalSpend,
      pricePerSqft: totalSqft > 0 ? totalSpend / totalSqft : 0,
      categoryBreakdown,
      recentPriceChanges: [] // Could be enhanced to show recent material additions
    };
  };

  const fetchProjectPricing = async (): Promise<PricingData> => {
    // Fetch project materials with costs
    const { data: projMaterials, error } = await supabase
      .from('proj_materials')
      .select(`
        quantity, cost_per_sqft, cost_per_unit, total_cost, square_feet,
        materials(category, name, price_per_sqft, price_per_unit, unit_type)
      `)
      .eq('project_id', entityId)
      .eq('studio_id', studioId);

    if (error) throw error;

    let totalSpend = 0;
    let totalSqft = 0;
    const categoryMap = new Map();

    projMaterials?.forEach(pm => {
      const cost = pm.total_cost || 0;
      totalSpend += cost;
      totalSqft += pm.square_feet || 0;

      const category = pm.materials?.category || 'Unknown';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          totalSpend: 0,
          materialCount: 0,
          averagePrice: 0
        });
      }
      const categoryData = categoryMap.get(category);
      categoryData.totalSpend += cost;
      categoryData.materialCount += 1;
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map(cat => ({
      ...cat,
      averagePrice: cat.materialCount > 0 ? cat.totalSpend / cat.materialCount : 0
    }));

    return {
      averagePrice: projMaterials?.length > 0 ? totalSpend / projMaterials.length : 0,
      totalMaterials: projMaterials?.length || 0,
      totalSpend,
      pricePerSqft: totalSqft > 0 ? totalSpend / totalSqft : 0,
      categoryBreakdown,
      recentPriceChanges: []
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading pricing analytics...</div>;
  }

  if (!pricingData) {
    return <div className="text-sm text-gray-500">No pricing data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {type === 'manufacturer' ? 'Avg Material Price' : 
               type === 'client' ? 'Avg Cost per Material' : 'Avg Material Cost'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pricingData.averagePrice)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pricingData.totalMaterials}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {type === 'manufacturer' ? 'Total Revenue' : 'Total Spend'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pricingData.totalSpend)}</div>
          </CardContent>
        </Card>

        {(type === 'client' || type === 'project') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost per Sq Ft</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(pricingData.pricePerSqft)}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {pricingData.categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pricingData.categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{category.category}</div>
                    <div className="text-sm text-gray-500">
                      {category.materialCount} material{category.materialCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(category.totalSpend)}</div>
                    <div className="text-sm text-gray-500">
                      Avg: {formatCurrency(category.averagePrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {type === 'manufacturer' && pricingData.recentPriceChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Price Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pricingData.recentPriceChanges.map((change, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{change.materialName}</span>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(change.newPrice)}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(change.changeDate).toLocaleDateString()}
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

export default PricingAnalytics;
