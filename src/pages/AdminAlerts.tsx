
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Send, Plus, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AlertSeverity = Database['public']['Enums']['alert_severity'];

interface AlertTemplate {
  id: number;
  title: string;
  trigger: string;
  whyItMatters: string;
  severity: AlertSeverity;
  example: string;
  template: string;
}

const AdminAlerts = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [studios, setStudios] = useState<any[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<AlertTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  // Alert templates with full context
  const alertTemplates: AlertTemplate[] = [
    {
      id: 1,
      title: "Discontinued Material",
      trigger: "A material marked as 'discontinued' by a manufacturer is still listed in active or upcoming projects.",
      whyItMatters: "You need to replace it before delays occur.",
      severity: "high" as AlertSeverity,
      example: "Material 'Cerastone Grey' is no longer available — used in 3 active projects.",
      template: "Material '[MATERIAL_NAME]' is no longer available — used in [NUMBER] active projects."
    },
    {
      id: 2,
      title: "Excessive Usage",
      trigger: "A material is used in more than X number of projects this month (customizable threshold).",
      whyItMatters: "Could indicate over-dependence, risk of price increases or delays.",
      severity: "medium" as AlertSeverity,
      example: "'Oak Laminate Light' used in 12 projects this quarter — review for alternatives.",
      template: "'[MATERIAL_NAME]' used in [NUMBER] projects this [TIME_PERIOD] — review for alternatives."
    },
    {
      id: 3,
      title: "Missing Manufacturer Information",
      trigger: "A material has no linked manufacturer or missing key contact fields.",
      whyItMatters: "Causes friction during procurement or client inquiries.",
      severity: "medium" as AlertSeverity,
      example: "'Textured Vinyl Wallcovering' missing contact info for vendor.",
      template: "'[MATERIAL_NAME]' missing [MISSING_INFO] for vendor."
    },
    {
      id: 4,
      title: "Old Project Without Updates",
      trigger: "No update to a project in the last 30/60/90 days.",
      whyItMatters: "Could signal a stalled or forgotten project.",
      severity: "low" as AlertSeverity,
      example: "Project 'Green Loft 7' has no updates since March 12.",
      template: "Project '[PROJECT_NAME]' has no updates since [DATE]."
    },
    {
      id: 5,
      title: "Duplicate Materials",
      trigger: "Two materials with nearly identical names or categories exist (based on fuzzy match).",
      whyItMatters: "Creates confusion in reporting and ordering.",
      severity: "medium" as AlertSeverity,
      example: "'Oakwood Panel' and 'Oak Wood Panel' may be duplicates.",
      template: "'[MATERIAL_1]' and '[MATERIAL_2]' may be duplicates."
    },
    {
      id: 6,
      title: "Material Not Processed After X Days",
      trigger: "Onboarding material hasn't been processed in more than 7/14 days.",
      whyItMatters: "Delays full system adoption and affects analytics.",
      severity: "medium" as AlertSeverity,
      example: "12 materials awaiting onboarding for Studio X for over 14 days.",
      template: "[NUMBER] materials awaiting onboarding for [STUDIO_NAME] for over [DAYS] days."
    },
    {
      id: 7,
      title: "Sudden Drop in Material Use",
      trigger: "A previously popular material hasn't been used in any project in the last N months.",
      whyItMatters: "Could be discontinued, unpopular, or forgotten.",
      severity: "low" as AlertSeverity,
      example: "'Bianco Quartz' not used in any project since Q1.",
      template: "'[MATERIAL_NAME]' not used in any project since [TIME_PERIOD]."
    },
    {
      id: 8,
      title: "Missing Category or Subcategory",
      trigger: "Material lacks a defined category or subcategory.",
      whyItMatters: "Incomplete data messes with dashboards and reporting.",
      severity: "low" as AlertSeverity,
      example: "5 materials missing category assignments.",
      template: "[NUMBER] materials missing [MISSING_FIELD] assignments."
    }
  ];

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
        .select('*')
        .order('name');

      if (error) throw error;
      setStudios(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
      toast({
        title: "Error",
        description: "Failed to fetch studios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectTemplate = (template: AlertTemplate) => {
    setSelectedTemplate(template);
    setCustomMessage(template.template);
  };

  const sendCustomAlert = async () => {
    if (!selectedStudio || !customMessage.trim() || !selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a studio and customize the alert message",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('alerts')
        .insert({
          studio_id: selectedStudio,
          message: customMessage.trim(),
          severity: selectedTemplate.severity,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom alert sent successfully",
      });
      
      // Reset form
      setSelectedTemplate(null);
      setCustomMessage('');
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Error",
        description: "Failed to send alert",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Alerts</h1>
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <span className="text-sm text-gray-500">Send customized alerts to studios</span>
        </div>
      </div>

      {/* Studio Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Target Studio</CardTitle>
          <CardDescription>Choose which studio to send alerts to</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedStudio} onValueChange={setSelectedStudio}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a studio" />
            </SelectTrigger>
            <SelectContent>
              {studios.map((studio) => (
                <SelectItem key={studio.id} value={studio.id}>
                  {studio.name} ({studio.subscription_tier})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Alert Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Architecture Material Alert Templates
          </CardTitle>
          <CardDescription>
            Select an alert type below to customize and send to the selected studio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {alertTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                } ${!selectedStudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedStudio && selectTemplate(template)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{template.title}</h4>
                        <Badge className={getSeverityColor(template.severity)}>
                          {template.severity}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Trigger:</span> {template.trigger}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Why it matters:</span> {template.whyItMatters}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Example:</span> 
                          <span className="italic text-gray-600"> "{template.example}"</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!selectedStudio}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTemplate(template);
                      }}
                      className="ml-4"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Alert Editor */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Customize Alert: {selectedTemplate.title}
            </CardTitle>
            <CardDescription>
              Edit the message below to fit your specific situation. Use the template as a guide.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Message
              </label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Customize your alert message..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Severity:</span>
              <Badge className={getSeverityColor(selectedTemplate.severity)}>
                {selectedTemplate.severity}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={sendCustomAlert}
                disabled={!selectedStudio || !customMessage.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Custom Alert
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTemplate(null);
                  setCustomMessage('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">How to use:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select a target studio from the dropdown above</li>
              <li>Choose an alert template that matches your situation</li>
              <li>Customize the message to include specific details (materials, projects, dates, etc.)</li>
              <li>Send the personalized alert to the studio</li>
              <li>Studio users will see the alert in their alerts page and can resolve it as needed</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAlerts;
