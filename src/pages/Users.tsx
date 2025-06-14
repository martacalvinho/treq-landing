
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Edit, User, Mail } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import AddUserForm from '@/components/forms/AddUserForm';
import AssignStudioForm from '@/components/forms/AssignStudioForm';

const Users = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudioFilter, setSelectedStudioFilter] = useState<string>(
    searchParams.get('studio') || 'all'
  );

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStudios();
    }
  }, [isAdmin]);

  useEffect(() => {
    // Update URL when studio filter changes
    if (selectedStudioFilter === 'all') {
      searchParams.delete('studio');
    } else {
      searchParams.set('studio', selectedStudioFilter);
    }
    setSearchParams(searchParams);
  }, [selectedStudioFilter, searchParams, setSearchParams]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          studios(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudios = async () => {
    try {
      const { data, error } = await supabase
        .from('studios')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setStudios(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studios?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStudio = selectedStudioFilter === 'all' || 
      (selectedStudioFilter === 'no-studio' && !user.studio_id) ||
      user.studio_id === selectedStudioFilter;

    return matchesSearch && matchesStudio;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'studio_user': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <AddUserForm onUserAdded={fetchUsers} studios={studios} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedStudioFilter} onValueChange={setSelectedStudioFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by studio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Studios</SelectItem>
                  <SelectItem value="no-studio">No Studio Assigned</SelectItem>
                  {studios.map((studio) => (
                    <SelectItem key={studio.id} value={studio.id}>
                      {studio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <User className="h-6 w-6 text-coral-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {user.first_name} {user.last_name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Studio: {user.studios?.name || 'No studio assigned'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AssignStudioForm user={user} onUserUpdated={fetchUsers} />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || selectedStudioFilter !== 'all' 
                  ? 'No users found matching your filters.' 
                  : 'No users yet.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
