
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Clock, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentUserActivity = () => {
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      // Get recent users with their studios
      const { data: users } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          created_at,
          role,
          studios(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentUsers(users || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'studio_user': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Recent User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading recent activity...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Recent User Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-coral-100 text-coral-700">
                    {getInitials(user.first_name, user.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {user.first_name} {user.last_name}
                  </h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.studios && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Building className="h-3 w-3" />
                      {user.studios.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge className={getRoleColor(user.role)}>
                  {user.role.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent user activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUserActivity;
