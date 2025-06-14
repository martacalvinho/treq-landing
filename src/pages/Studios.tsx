
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Building, Users, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddStudioForm from '@/components/forms/AddStudioForm';
import EditStudioForm from '@/components/forms/EditStudioForm';

const Studios = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('');

  useEffect(() => {
    if (isAdmin) {
      fetchStudios();
    }
  }, [isAdmin]);

  const fetchStudios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('studios')
        .select(`
          *,
          users(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudios(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudios = studios.filter(studio => {
    const matchesSearch = studio.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === '' || studio.subscription_tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-700';
      case 'professional': return 'bg-blue-100 text-blue-700';
      case 'starter': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleManageUsers = (studioId: string) => {
    // Navigate to users page with studio filter
    navigate(`/users?studio=${studioId}`);
  };

  const handleViewData = (studioId: string) => {
    // Navigate to studio-specific dashboard
    navigate(`/studios/${studioId}/dashboard`);
  };

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading studios...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Studios Management</h1>
        <AddStudioForm onStudioAdded={fetchStudios} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Studios</CardTitle>
              <CardDescription>Manage all studios in the system</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search studios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative w-48">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="All tiers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All tiers</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudios.map((studio) => {
              const userCount = studio.users?.length || 0;
              return (
                <div key={studio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-coral-100 rounded-lg">
                      <Building className="h-6 w-6 text-coral-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{studio.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge className={getSubscriptionColor(studio.subscription_tier)}>
                          {studio.subscription_tier}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{userCount} user{userCount !== 1 ? 's' : ''}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Created: {new Date(studio.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleManageUsers(studio.id)}
                    >
                      Manage Users
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewData(studio.id)}
                    >
                      View Data
                    </Button>
                    <EditStudioForm studio={studio} onStudioUpdated={fetchStudios} />
                  </div>
                </div>
              );
            })}
            {filteredStudios.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || selectedTier ? 'No studios found matching your criteria.' : 'No studios yet.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Studios;
