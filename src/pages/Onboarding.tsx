
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, MapPin, Eye, Download } from 'lucide-react';
import FileUploadZone from '@/components/FileUploadZone';
import { useMaterialsUpload } from '@/hooks/useMaterialsUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const { isAdmin } = useAuth();
  const { uploadFile, isUploading } = useMaterialsUpload();
  const { toast } = useToast();
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<string>('');
  const [studios, setStudios] = useState<any[]>([]);
  const [extractedMaterials, setExtractedMaterials] = useState<any[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchStudios();
    }
  }, [isAdmin]);

  const fetchStudios = async () => {
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching studios:', error);
    } else {
      setStudios(data || []);
    }
  };

  const fetchOnboardingMaterials = async () => {
    if (!selectedStudio) return;

    const { data, error } = await supabase
      .from('onboarding_materials')
      .select('*')
      .eq('studio_id', selectedStudio)
      .eq('processed', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
    } else {
      setExtractedMaterials(data || []);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedStudio) {
      toast({
        title: "Missing information",
        description: "Please select a file and studio",
        variant: "destructive",
      });
      return;
    }

    const result = await uploadFile(selectedFile, selectedStudio);
    if (result.success) {
      setUploadStep(2);
      await fetchOnboardingMaterials();
    }
  };

  const handleMaterialEdit = async (materialId: string, updates: any) => {
    const { error } = await supabase
      .from('onboarding_materials')
      .update(updates)
      .eq('id', materialId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update material",
        variant: "destructive",
      });
    } else {
      setEditingMaterial(null);
      await fetchOnboardingMaterials();
      toast({
        title: "Success",
        description: "Material updated successfully",
      });
    }
  };

  const finalizeImport = async () => {
    if (!selectedStudio || extractedMaterials.length === 0) return;

    try {
      // First, create manufacturers that don't exist
      const uniqueManufacturers = [...new Set(
        extractedMaterials
          .filter(m => m.manufacturer_name)
          .map(m => m.manufacturer_name)
      )];

      for (const manufacturerName of uniqueManufacturers) {
        const { data: existing } = await supabase
          .from('manufacturers')
          .select('id')
          .eq('studio_id', selectedStudio)
          .eq('name', manufacturerName)
          .single();

        if (!existing) {
          await supabase
            .from('manufacturers')
            .insert({
              studio_id: selectedStudio,
              name: manufacturerName,
            });
        }
      }

      // Get all manufacturers for this studio
      const { data: manufacturers } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('studio_id', selectedStudio);

      // Create materials
      for (const onboardingMaterial of extractedMaterials) {
        const manufacturer = manufacturers?.find(m => m.name === onboardingMaterial.manufacturer_name);
        
        await supabase
          .from('materials')
          .insert({
            studio_id: selectedStudio,
            name: onboardingMaterial.material_name,
            category: onboardingMaterial.category,
            manufacturer_id: manufacturer?.id || null,
            notes: onboardingMaterial.notes,
          });
      }

      // Mark onboarding materials as processed
      await supabase
        .from('onboarding_materials')
        .update({ 
          processed: true, 
          processed_date: new Date().toISOString() 
        })
        .eq('studio_id', selectedStudio)
        .eq('processed', false);

      setUploadStep(3);
      toast({
        title: "Import complete",
        description: `Successfully imported ${extractedMaterials.length} materials`,
      });

    } catch (error) {
      console.error('Error finalizing import:', error);
      toast({
        title: "Error",
        description: "Failed to complete import",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Material Import Wizard</h1>
        <div className="text-sm text-gray-500">
          Step {uploadStep} of 3
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{uploadStep}/3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-coral h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(uploadStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Upload File */}
        {uploadStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Step 1: Upload Material Schedule
              </CardTitle>
              <CardDescription>
                Upload a PDF, image, or CSV file containing materials data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploadZone onFileSelect={setSelectedFile} />
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Target Studio
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={selectedStudio}
                    onChange={(e) => setSelectedStudio(e.target.value)}
                  >
                    <option value="">Choose a studio...</option>
                    {studios.map((studio) => (
                      <option key={studio.id} value={studio.id}>
                        {studio.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-coral hover:bg-coral-600"
                  onClick={handleFileUpload}
                  disabled={!selectedFile || !selectedStudio || isUploading}
                >
                  {isUploading ? 'Processing...' : 'Process File'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review Extracted Materials */}
        {uploadStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Step 2: Review Extracted Materials
              </CardTitle>
              <CardDescription>
                Review and edit the materials extracted by AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Found {extractedMaterials.length} materials. Review and edit as needed:
                </p>
                
                {extractedMaterials.length > 0 ? (
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-5 gap-4 p-3 bg-gray-50 text-sm font-medium text-gray-700 border-b">
                      <div>Material Name</div>
                      <div>Category</div>
                      <div>Manufacturer</div>
                      <div>Notes</div>
                      <div>Action</div>
                    </div>
                    <div className="divide-y max-h-96 overflow-y-auto">
                      {extractedMaterials.map((material) => (
                        <div key={material.id} className="grid grid-cols-5 gap-4 p-3 text-sm">
                          <div className="font-medium">{material.material_name}</div>
                          <div>{material.category}</div>
                          <div>{material.manufacturer_name || 'None'}</div>
                          <div className="truncate" title={material.notes}>
                            {material.notes || 'None'}
                          </div>
                          <div>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No materials found. Please go back and try a different file.</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setUploadStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="bg-coral hover:bg-coral-600"
                    onClick={finalizeImport}
                    disabled={extractedMaterials.length === 0}
                  >
                    Import All Materials
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Complete */}
        {uploadStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Import Complete
              </CardTitle>
              <CardDescription>
                Successfully imported {extractedMaterials.length} materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Successfully imported {extractedMaterials.length} materials<br/>
                    ✅ Created new manufacturers as needed<br/>
                    ✅ All materials assigned to selected studio
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-coral hover:bg-coral-600">
                    View Imported Materials
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setUploadStep(1);
                    setSelectedFile(null);
                    setExtractedMaterials([]);
                  }}>
                    Import More Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
