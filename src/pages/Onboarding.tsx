
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const Onboarding = () => {
  const { isAdmin } = useAuth();
  const [uploadStep, setUploadStep] = useState(1);

  if (!isAdmin) {
    return <div className="p-6">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Onboarding Wizard</h1>
        <div className="text-sm text-gray-500">
          Step {uploadStep} of 5
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{uploadStep}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-coral h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(uploadStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {uploadStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Step 1: Upload CSV File
              </CardTitle>
              <CardDescription>
                Upload a CSV file containing materials data to import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-coral-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-coral-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported format: CSV files up to 10MB
                </p>
                <Button className="bg-coral hover:bg-coral-600">
                  Choose File
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Expected CSV format:</p>
                <p>material_name, category, manufacturer_name, notes</p>
              </div>
            </CardContent>
          </Card>
        )}

        {uploadStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Map Columns</CardTitle>
              <CardDescription>
                Map your CSV columns to the correct fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Preview of your data and column mapping:
                </p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 mb-2">
                    <div>CSV Column</div>
                    <div>Maps To</div>
                    <div>Sample Data</div>
                    <div>Action</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>Product Name</div>
                    <div>Material Name</div>
                    <div>White Oak Flooring</div>
                    <div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {uploadStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Assign to Studio</CardTitle>
              <CardDescription>
                Select which studio this data belongs to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Studio
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="">Choose a studio...</option>
                    <option value="studio1">Design Studio A</option>
                    <option value="studio2">Creative Interiors</option>
                    <option value="studio3">Premium Architects</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {uploadStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Review Data</CardTitle>
              <CardDescription>
                Review and edit the imported data before finalizing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Found 45 materials to import. Review and edit as needed:
                </p>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 text-sm font-medium text-gray-700 border-b">
                    <div>Material Name</div>
                    <div>Category</div>
                    <div>Manufacturer</div>
                    <div>Action</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-4 gap-4 p-3 text-sm">
                      <div>White Oak Flooring</div>
                      <div>Flooring</div>
                      <div>WoodCo</div>
                      <div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-3 text-sm">
                      <div>Marble Tile</div>
                      <div>Surface</div>
                      <div>StoneMakers</div>
                      <div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {uploadStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Import Complete
              </CardTitle>
              <CardDescription>
                Successfully imported 45 materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Successfully imported 45 materials<br/>
                    ✅ Created 12 new manufacturers<br/>
                    ✅ Assigned to Design Studio A
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-coral hover:bg-coral-600">
                    View Imported Materials
                  </Button>
                  <Button variant="outline" onClick={() => setUploadStep(1)}>
                    Import More Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            disabled={uploadStep === 1}
            onClick={() => setUploadStep(Math.max(1, uploadStep - 1))}
          >
            Previous
          </Button>
          <Button 
            className="bg-coral hover:bg-coral-600"
            disabled={uploadStep === 5}
            onClick={() => setUploadStep(Math.min(5, uploadStep + 1))}
          >
            {uploadStep === 4 ? 'Import Data' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
