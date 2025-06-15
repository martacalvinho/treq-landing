
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      studioName, 
      contactName, 
      email, 
      phone, 
      selectedPlan, 
      monthlyMaterials, 
      onboardingMaterials,
      onboardingInterest, 
      message 
    } = await req.json()

    const planNames = {
      starter: 'Starter ($29/month)',
      studio: 'Studio ($89/month)', 
      growth: 'Growth ($299/month)'
    }

    const calculateOnboardingPrice = (materials: number) => {
      if (materials <= 100) return 99;
      if (materials <= 500) return 499;
      if (materials <= 1500) return 999;
      return 999 + Math.ceil((materials - 1500) * 1.5);
    }

    const onboardingPrice = onboardingInterest === 'yes' ? calculateOnboardingPrice(onboardingMaterials) : 0;

    const emailContent = `
New Lead Submission - Treqy

Studio Name: ${studioName}
Contact Person: ${contactName}
Email: ${email}
Phone: ${phone || 'Not provided'}

Selected Plan: ${planNames[selectedPlan as keyof typeof planNames]}
Monthly Materials Estimate: ${monthlyMaterials[0]}
Onboarding Interest: ${onboardingInterest === 'yes' ? 'Yes' : 'No'}
${onboardingInterest === 'yes' ? `Material History to Onboard: ${onboardingMaterials} materials ($${onboardingPrice} one-time)` : ''}

Message:
${message || 'No additional message'}

---
Please follow up within 1 business day with invoice and setup instructions.
    `

    // Here you would integrate with your email service
    // For now, we'll just log it
    console.log('New lead notification:', emailContent)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
