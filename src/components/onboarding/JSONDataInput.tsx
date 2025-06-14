
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, Copy } from 'lucide-react';

interface JSONDataInputProps {
  studioId: string;
}

const TEMPLATE_JSON = {
  materials: [
    {
      name: "White Oak Flooring",
      category: "Flooring",
      subcategory: "Hardwood",
      manufacturer_name: "Premium Woods Co",
      tag: "Premium",
      location: "Living room",
      notes: "Available in 3 finishes"
    },
    {
      name: "Carrara Marble",
      category: "Stone", 
      subcategory: "Marble",
      manufacturer_name: "Stone Masters",
      tag: "Luxury",
      location: "Kitchen",
      notes: "Bookmatched slabs available"
    }
  ],
  manufacturers: [
    {
      name: "Premium Woods Co",
      contact_name: "John Smith",
      email: "john@premiumwoods.com",
      phone: "+1-555-0123",
      website: "premiumwoods.com",
      notes: "Lead time 4-6 weeks"
    },
    {
      name: "Stone Masters",
      contact_name: "Sarah Johnson", 
      email: "sarah@stonemasters.com",
      phone: "+1-555-0456",
      website: "stonemasters.com",
      notes: "Custom fabrication available"
    }
  ],
  clients: [
    {
      name: "Smith Residence",
      notes: "High-end residential project"
    },
    {
      name: "Downtown Office Building",
      notes: "Commercial office space renovation"
    }
  ]
};

const JSONDataInput = ({ studioId }: JSONDataInputProps) => {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);

  const copyTemplate = () => {
    const templateString = JSON.stringify(TEMPLATE_JSON, null, 2);
    setJsonInput(templateString);
    navigator.clipboard.writeText(templateString);
    toast({
      title: "Template copied",
      description: "JSON template has been copied to the input field and clipboard",
    });
  };

  const validateAndParseJSON = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate structure
      if (!data.materials && !data.manufacturers && !data.clients) {
        throw new Error('JSON must contain at least one of: materials, manufacturers, or clients');
      }

      // Validate materials
      if (data.materials && !Array.isArray(data.materials)) {
        throw new Error('materials must be an array');
      }
      
      // Validate manufacturers  
      if (data.manufacturers && !Array.isArray(data.manufacturers)) {
        throw new Error('manufacturers must be an array');
      }

      // Validate clients
      if (data.clients && !Array.isArray(data.clients)) {
        throw new Error('clients must be an array');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const importData = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON data to import",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const data = validateAndParseJSON(jsonInput);

      let materialsImported = 0;
      let manufacturersImported = 0; 
      let clientsImported = 0;

      // Import manufacturers first
      if (data.manufacturers && data.manufacturers.length > 0) {
        const manufacturerInserts = data.manufacturers
          .filter((m: any) => m.name && m.name.trim())
          .map((m: any) => ({
            name: m.name,
            contact_name: m.contact_name || null,
            email: m.email || null,
            phone: m.phone || null,
            website: m.website || null,
            notes: m.notes || null,
            studio_id: studioId
          }));

        if (manufacturerInserts.length > 0) {
          const { data: manufacturerData, error: manufacturerError } = await supabase
            .from('manufacturers')
            .insert(manufacturerInserts)
            .select();

          if (manufacturerError) throw manufacturerError;
          manufacturersImported = manufacturerData?.length || 0;
        }
      }

      // Import clients
      if (data.clients && data.clients.length > 0) {
        const clientInserts = data.clients
          .filter((c: any) => c.name && c.name.trim())
          .map((c: any) => ({
            name: c.name,
            notes: c.notes || null,
            studio_id: studioId
          }));

        if (clientInserts.length > 0) {
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .insert(clientInserts)
            .select();

          if (clientError) throw clientError;
          clientsImported = clientData?.length || 0;
        }
      }

      // Get all manufacturers for linking materials
      const { data: allManufacturers } = await supabase
        .from('manufacturers')
        .select('id, name')
        .eq('studio_id', studioId);

      // Import materials
      if (data.materials && data.materials.length > 0) {
        const materialInserts = data.materials
          .filter((m: any) => m.name && m.name.trim() && m.category && m.category.trim())
          .map((m: any) => {
            const manufacturer = allManufacturers?.find(sm => sm.name === m.manufacturer_name);
            return {
              name: m.name,
              category: m.category,
              subcategory: m.subcategory || null,
              manufacturer_id: manufacturer?.id || null,
              tag: m.tag || null,
              location: m.location || null,
              notes: m.notes || null,
              studio_id: studioId
            };
          });

        if (materialInserts.length > 0) {
          const { data: materialData, error: materialError } = await supabase
            .from('materials')
            .insert(materialInserts)
            .select();

          if (materialError) throw materialError;
          materialsImported = materialData?.length || 0;
        }
      }

      toast({
        title: "Import successful",
        description: `Imported ${materialsImported} materials, ${manufacturersImported} manufacturers, and ${clientsImported} clients`,
      });

      setJsonInput('');

    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message || "Failed to import data. Please check your JSON format.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Template */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              JSON Template
            </CardTitle>
            <CardDescription>
              Use this template format for your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-96">
                {JSON.stringify(TEMPLATE_JSON, null, 2)}
              </pre>
              <Button onClick={copyTemplate} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Template to Input
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>JSON Data Input</CardTitle>
            <CardDescription>
              Paste your JSON data here following the template format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON data here..."
                className="min-h-96 font-mono text-sm"
              />
              <Button 
                onClick={importData} 
                disabled={importing || !jsonInput.trim()}
                className="w-full bg-coral hover:bg-coral-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? 'Importing...' : 'Import Data'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Required fields:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Materials:</strong> name and category are required</li>
              <li><strong>Manufacturers:</strong> name is required</li>
              <li><strong>Clients:</strong> name is required</li>
            </ul>
            <p className="mt-4"><strong>Available material categories:</strong></p>
            <p className="text-gray-600">Flooring, Surface, Tile, Stone, Wood, Metal, Glass, Fabric, Lighting, Hardware, Other</p>
            <p className="mt-4"><strong>Common tags:</strong></p>
            <p className="text-gray-600">Sustainable, Premium, Fire-rated, Water-resistant, Low-maintenance, Custom, Standard, Luxury, Budget-friendly, Eco-friendly</p>
            <p className="mt-4"><strong>Common locations:</strong></p>
            <p className="text-gray-600">Kitchen, Bathroom, Living room, Bedroom, Exterior, Commercial, Office, Hallway, Entrance, Outdoor</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JSONDataInput;
