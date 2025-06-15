
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const GetStarted = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const initialPlan = searchParams.get('plan') || 'starter';
  
  const [formData, setFormData] = useState({
    studioName: '',
    contactName: '',
    email: '',
    phone: '',
    selectedPlan: initialPlan,
    monthlyMaterials: [250],
    onboardingMaterials: [300],
    onboardingInterest: 'yes',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const planNames = {
    starter: 'Starter',
    studio: 'Studio', 
    growth: 'Growth'
  };

  const calculateOnboardingPrice = (materials: number) => {
    if (materials <= 100) return 99;
    if (materials <= 500) return 499;
    if (materials <= 1500) return 999;
    return 999 + Math.ceil((materials - 1500) * 1.5);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead to Supabase
      const { error } = await supabase
        .from('leads')
        .insert({
          studio_name: formData.studioName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          selected_plan: formData.selectedPlan,
          monthly_materials_estimate: formData.monthlyMaterials[0],
          onboarding_interest: formData.onboardingInterest === 'yes',
          message: formData.message,
          status: 'new'
        });

      if (error) throw error;

      // Send email notification to team
      await supabase.functions.invoke('send-lead-notification', {
        body: {
          ...formData,
          onboardingMaterials: formData.onboardingMaterials[0]
        }
      });

      setSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "We'll follow up within 1 business day with your invoice.",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen font-inter">
        <Navigation />
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CardTitle className="text-3xl text-coral">Thank You!</CardTitle>
                <CardDescription className="text-lg">
                  We'll review your request and follow up within 1 business day with your invoice and onboarding info.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/')} className="bg-coral hover:bg-coral-600">
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gray-900">Get Started with Treqy</CardTitle>
                <CardDescription className="text-lg">
                  Fill out the form below and we'll send you a personalized invoice + setup instructions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studioName">Studio Name *</Label>
                      <Input
                        id="studioName"
                        type="text"
                        required
                        value={formData.studioName}
                        onChange={(e) => handleInputChange('studioName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactName">Contact Person *</Label>
                      <Input
                        id="contactName"
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="selectedPlan">Selected Plan</Label>
                    <Select value={formData.selectedPlan} onValueChange={(value) => handleInputChange('selectedPlan', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter - $29/month (up to 100 materials)</SelectItem>
                        <SelectItem value="studio">Studio - $89/month (up to 500 materials)</SelectItem>
                        <SelectItem value="growth">Growth - $299/month (up to 1,500 materials)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Monthly Materials Estimate: {formData.monthlyMaterials[0]} materials</Label>
                    <Slider
                      value={formData.monthlyMaterials}
                      onValueChange={(value) => handleInputChange('monthlyMaterials', value)}
                      max={2000}
                      min={50}
                      step={25}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Onboarding Interest</Label>
                    <RadioGroup 
                      value={formData.onboardingInterest} 
                      onValueChange={(value) => handleInputChange('onboardingInterest', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="onboarding-yes" />
                        <Label htmlFor="onboarding-yes">Yes, I'm interested in onboarding services</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="onboarding-no" />
                        <Label htmlFor="onboarding-no">No, I'll set up materials myself</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.onboardingInterest === 'yes' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Label>Material History to Onboard: {formData.onboardingMaterials[0]} materials</Label>
                      <Slider
                        value={formData.onboardingMaterials}
                        onValueChange={(value) => handleInputChange('onboardingMaterials', value)}
                        max={2000}
                        min={50}
                        step={25}
                        className="mt-2 mb-4"
                      />
                      <div className="text-center">
                        <div className="text-lg font-bold text-coral">
                          ${calculateOnboardingPrice(formData.onboardingMaterials[0])} one-time
                        </div>
                        <div className="text-sm text-gray-600">
                          Setup fee for {formData.onboardingMaterials[0]} materials
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="message">Anything else we should know?</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your studio, timeline, or any specific needs..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-coral hover:bg-coral-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GetStarted;
