
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, BarChart3 } from 'lucide-react';

const UsageAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    platformGrowth: [],
    subscriptionDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get studios and users for growth tracking
      const { data: studios } = await supabase
        .from('studios')
        .select('created_at, subscription_tier');

      const { data: users } = await supabase
        .from('users')
        .select('created_at');

      if (studios && users) {
        // Create platform growth data (users and studios by month)
        const growthData = [...studios, ...users].reduce((acc: any[], item) => {
          const month = new Date(item.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
          });
          const existing = acc.find(entry => entry.month === month);
          
          if (existing) {
            if (studios.includes(item)) {
              existing.studios += 1;
            } else {
              existing.users += 1;
            }
          } else {
            acc.push({
              month,
              studios: studios.includes(item) ? 1 : 0,
              users: studios.includes(item) ? 0 : 1
            });
          }
          return acc;
        }, []);

        // Sort by date and take last 6 months
        const sortedGrowth = growthData
          .sort((a, b) => new Date(`${a.month} 1`).getTime() - new Date(`${b.month} 1`).getTime())
          .slice(-6);

        // Create subscription tier distribution
        const tierDistribution = studios.reduce((acc: any[], studio) => {
          const existing = acc.find(item => item.tier === studio.subscription_tier);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ 
              tier: studio.subscription_tier.charAt(0).toUpperCase() + studio.subscription_tier.slice(1), 
              count: 1 
            });
          }
          return acc;
        }, []);

        setAnalyticsData({
          platformGrowth: sortedGrowth,
          subscriptionDistribution: tierDistribution
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
    users: {
      label: "Users", 
      color: "hsl(var(--secondary))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
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
            Platform Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.platformGrowth}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 'dataMax + 10']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="studios" 
                  stroke="var(--color-studios)" 
                  strokeWidth={2}
                  name="Studios"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="var(--color-users)" 
                  strokeWidth={2}
                  name="Users"
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
            Subscription Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.subscriptionDistribution}>
                <XAxis dataKey="tier" />
                <YAxis domain={[0, 'dataMax + 5']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalytics;
