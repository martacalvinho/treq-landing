
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, BarChart3 } from 'lucide-react';

const UsageAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    studioGrowth: [],
    materialsByStudio: [],
    projectsByStudio: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get studios with their material and project counts
      const { data: studios } = await supabase
        .from('studios')
        .select(`
          id,
          name,
          created_at,
          subscription_tier
        `);

      if (studios) {
        // Get material counts per studio
        const materialCounts = await Promise.all(
          studios.map(async (studio) => {
            const { count } = await supabase
              .from('materials')
              .select('id', { count: 'exact', head: true })
              .eq('studio_id', studio.id);
            return { studioName: studio.name, materials: count || 0 };
          })
        );

        // Get project counts per studio
        const projectCounts = await Promise.all(
          studios.map(async (studio) => {
            const { count } = await supabase
              .from('projects')
              .select('id', { count: 'exact', head: true })
              .eq('studio_id', studio.id);
            return { studioName: studio.name, projects: count || 0 };
          })
        );

        // Create growth data (simplified - showing studios created by month)
        const studioGrowth = studios.reduce((acc: any[], studio) => {
          const month = new Date(studio.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
          });
          const existing = acc.find(item => item.month === month);
          if (existing) {
            existing.studios += 1;
          } else {
            acc.push({ month, studios: 1 });
          }
          return acc;
        }, []);

        setAnalyticsData({
          studioGrowth: studioGrowth.slice(-6), // Last 6 months
          materialsByStudio: materialCounts.slice(0, 8), // Top 8 studios
          projectsByStudio: projectCounts.slice(0, 8)
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    studios: {
      label: "Studios",
      color: "hsl(var(--primary))",
    },
    materials: {
      label: "Materials",
      color: "hsl(var(--primary))",
    },
    projects: {
      label: "Projects",
      color: "hsl(var(--secondary))",
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading analytics...</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading analytics...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Studio Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.studioGrowth}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="studios" 
                  stroke="var(--color-studios)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Materials by Studio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.materialsByStudio}>
                <XAxis 
                  dataKey="studioName" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="materials" fill="var(--color-materials)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalytics;
