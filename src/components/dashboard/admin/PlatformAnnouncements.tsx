
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Plus, Calendar, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PlatformAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    severity: 'medium'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Using alerts table to store announcements (platform-wide alerts)
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .is('studio_id', null) // Platform-wide announcements
        .order('date_created', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Subject and message are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create a platform-wide alert as announcement
      const { error } = await supabase
        .from('alerts')
        .insert([{
          message: `${formData.subject}: ${formData.message}`,
          severity: formData.severity as any,
          status: 'active',
          studio_id: null // Platform-wide
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement created successfully"
      });

      setFormData({ subject: '', message: '', severity: 'medium' });
      setIsOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Megaphone;
      default: return Calendar;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Platform Announcements
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Platform Announcement</DialogTitle>
                <DialogDescription>
                  Broadcast an update to all studios on the platform
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Announcement subject"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Announcement details..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="severity">Priority</Label>
                  <Select 
                    value={formData.severity} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreateAnnouncement} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating...' : 'Create Announcement'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const SeverityIcon = getSeverityIcon(announcement.severity);
            const [subject, ...messageParts] = announcement.message.split(': ');
            const message = messageParts.join(': ');
            
            return (
              <div key={announcement.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SeverityIcon className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">{subject}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(announcement.severity)}>
                      {announcement.severity}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(announcement.date_created), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                {message && (
                  <p className="text-sm text-gray-600">{message}</p>
                )}
              </div>
            );
          })}
          {announcements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No announcements yet. Create your first platform announcement.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformAnnouncements;
