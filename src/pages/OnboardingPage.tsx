
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import OnboardingStatus from '@/components/onboarding/OnboardingStatus';
import { supabase } from '@/integrations/supabase/client';

const OnboardingPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkOnboardingStatus();
  }, [user, userProfile]);

  const checkOnboardingStatus = async () => {
    if (!user || !userProfile?.studio_id) {
      setLoading(false);
      return;
    }

    try {
      // Check if user has completed onboarding by looking at studio subscription tier
      const { data: studio } = await supabase
        .from('studios')
        .select('subscription_tier')
        .eq('id', userProfile.studio_id)
        .single();

      // If studio has subscription tier other than starter, assume onboarding is complete
      if (studio && studio.subscription_tier !== 'starter') {
        setNeedsOnboarding(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!needsOnboarding) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <OnboardingStatus 
            status={userProfile?.studios?.subscription_tier === 'starter' ? 'pending' : 'active'}
            subscriptionTier={userProfile?.studios?.subscription_tier || 'starter'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Material Dashboard</h1>
          <p className="text-gray-600 mt-2">Let's get your studio set up in just a few steps</p>
        </div>
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    </div>
  );
};

export default OnboardingPage;
