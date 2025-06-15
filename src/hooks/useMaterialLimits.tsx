
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MaterialLimitsContextType {
  canAddMaterial: boolean;
  monthlyCount: number;
  monthlyLimit: number;
  billingPreference: string;
  checkAndHandleMaterialLimit: () => Promise<boolean>;
  updateBillingPreference: (preference: string) => Promise<void>;
  incrementMaterialCount: () => Promise<void>;
}

const MaterialLimitsContext = createContext<MaterialLimitsContextType | undefined>(undefined);

export const useMaterialLimits = () => {
  const context = useContext(MaterialLimitsContext);
  if (!context) {
    throw new Error('useMaterialLimits must be used within a MaterialLimitsProvider');
  }
  return context;
};

interface MaterialLimitsProviderProps {
  children: ReactNode;
}

export const MaterialLimitsProvider = ({ children }: MaterialLimitsProviderProps) => {
  const { userProfile, studioId } = useAuth();
  const { toast } = useToast();
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [billingPreference, setBillingPreference] = useState('blocked');
  
  const subscriptionLimits = {
    starter: 100,
    professional: 500,
    enterprise: 1500
  };

  const monthlyLimit = subscriptionLimits[userProfile?.studios?.subscription_tier as keyof typeof subscriptionLimits] || 100;
  const canAddMaterial = billingPreference !== 'blocked' || monthlyCount < monthlyLimit;

  useEffect(() => {
    if (studioId) {
      fetchStudioData();
    }
  }, [studioId]);

  const fetchStudioData = async () => {
    try {
      // First, get the current month materials count from the studio
      const { data: studioData, error: studioError } = await supabase
        .from('studios')
        .select('current_month_materials, billing_preference, current_month')
        .eq('id', studioId)
        .single();

      if (studioError) throw studioError;

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      // If we're in a new month or the studio doesn't have current_month set, reset and count actual materials
      if (!studioData.current_month || studioData.current_month !== currentMonth) {
        // Count actual materials added this month
        const { count: actualMonthlyCount, error: countError } = await supabase
          .from('materials')
          .select('*', { count: 'exact', head: true })
          .eq('studio_id', studioId)
          .gte('created_at', `${currentMonth}-01T00:00:00.000Z`)
          .lt('created_at', `${getNextMonth(currentMonth)}-01T00:00:00.000Z`);

        if (countError) throw countError;

        const realCount = actualMonthlyCount || 0;

        // Update studio with correct count and current month
        await supabase
          .from('studios')
          .update({
            current_month: currentMonth,
            current_month_materials: realCount
          })
          .eq('id', studioId);
        
        setMonthlyCount(realCount);
      } else {
        // Use the stored count, but verify it's accurate
        const { count: actualMonthlyCount, error: countError } = await supabase
          .from('materials')
          .select('*', { count: 'exact', head: true })
          .eq('studio_id', studioId)
          .gte('created_at', `${currentMonth}-01T00:00:00.000Z`)
          .lt('created_at', `${getNextMonth(currentMonth)}-01T00:00:00.000Z`);

        if (countError) throw countError;

        const realCount = actualMonthlyCount || 0;
        
        // If the stored count doesn't match the actual count, update it
        if (realCount !== (studioData.current_month_materials || 0)) {
          await supabase
            .from('studios')
            .update({ current_month_materials: realCount })
            .eq('id', studioId);
          
          setMonthlyCount(realCount);
        } else {
          setMonthlyCount(studioData.current_month_materials || 0);
        }
      }

      setBillingPreference(studioData.billing_preference || 'blocked');
    } catch (error) {
      console.error('Error fetching studio data:', error);
    }
  };

  // Helper function to get next month in YYYY-MM format
  const getNextMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-').map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
  };

  const checkAndHandleMaterialLimit = async (): Promise<boolean> => {
    if (monthlyCount >= monthlyLimit && billingPreference === 'blocked') {
      return false; // Will trigger the popup
    }
    return true; // Can proceed with adding material
  };

  const updateBillingPreference = async (preference: string) => {
    try {
      const { error } = await supabase
        .from('studios')
        .update({ billing_preference: preference })
        .eq('id', studioId);

      if (error) throw error;

      setBillingPreference(preference);
      
      if (preference === 'upgrade_pending') {
        toast({
          title: "Upgrade request submitted",
          description: "You can now continue adding materials while we process your upgrade.",
        });
      } else if (preference === 'per_material') {
        toast({
          title: "Per-material billing enabled",
          description: "You'll be charged $5 for each material above your monthly limit.",
        });
      }
    } catch (error) {
      console.error('Error updating billing preference:', error);
      toast({
        title: "Error",
        description: "Failed to update billing preference.",
        variant: "destructive",
      });
    }
  };

  const incrementMaterialCount = async () => {
    try {
      const newCount = monthlyCount + 1;
      const currentMonth = new Date().toISOString().slice(0, 7);

      // Update studio material count
      await supabase
        .from('studios')
        .update({
          current_month_materials: newCount,
          current_month: currentMonth
        })
        .eq('id', studioId);

      // If we're over the limit and using per-material billing, track the overage
      if (newCount > monthlyLimit && billingPreference === 'per_material') {
        const overageCount = newCount - monthlyLimit;
        const totalCharge = overageCount * 5.00; // $5 per extra material

        await supabase
          .from('material_overages')
          .upsert({
            studio_id: studioId,
            user_id: userProfile?.id,
            month_year: currentMonth,
            overage_count: overageCount,
            total_charge: totalCharge
          });
      }

      setMonthlyCount(newCount);
    } catch (error) {
      console.error('Error incrementing material count:', error);
      throw error;
    }
  };

  return (
    <MaterialLimitsContext.Provider
      value={{
        canAddMaterial,
        monthlyCount,
        monthlyLimit,
        billingPreference,
        checkAndHandleMaterialLimit,
        updateBillingPreference,
        incrementMaterialCount,
      }}
    >
      {children}
    </MaterialLimitsContext.Provider>
  );
};
