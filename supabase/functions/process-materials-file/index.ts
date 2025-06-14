
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const studioId = formData.get('studioId') as string;

    if (!file || !studioId) {
      throw new Error('File and studio ID are required');
    }

    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Get file content as base64 for AI processing
    const arrayBuffer = await file.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    let extractedText = '';
    const fileType = file.type;

    // For CSV files, convert to text directly
    if (fileType === 'text/csv' || file.name.endsWith('.csv')) {
      extractedText = new TextDecoder().decode(arrayBuffer);
    } else {
      // For PDFs and images, we'll send to AI for text extraction
      // Note: This is a simplified approach. For production, you might want to use specialized libraries
      extractedText = `[${fileType} file content - base64: ${base64Content.substring(0, 100)}...]`;
    }

    // Create AI prompt to extract material data
    const prompt = `
You are an expert at extracting material schedule data from various document formats. 
I have a file that contains material specifications. Please extract all materials and organize them into a structured format.

File type: ${fileType}
Content preview: ${extractedText.substring(0, 2000)}

Please extract materials and return them in this exact JSON format:
{
  "materials": [
    {
      "material_name": "exact material name",
      "category": "categorize as one of: Flooring, Wall Covering, Ceiling, Window Treatment, Furniture, Lighting, Plumbing, Hardware, Surface, Textile, Other",
      "manufacturer_name": "manufacturer name if available, or null",
      "notes": "any additional specifications, dimensions, colors, finishes, etc."
    }
  ]
}

Rules:
- Extract ALL materials mentioned
- Use exact names as written
- Categorize appropriately
- Include all relevant details in notes
- If manufacturer is unclear, use null
- Return valid JSON only, no other text
`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://specclarity.app',
        'X-Title': 'SpecClarity Material Extraction',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const extractedContent = aiResponse.choices[0].message.content;

    // Parse the AI response to extract JSON
    let materialsData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = extractedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        materialsData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', extractedContent);
      throw new Error('Failed to parse materials data from AI response');
    }

    // Initialize Supabase client
    const supabaseUrl = 'https://hsufpuzlavxodhwklulr.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey!);

    // Store extracted materials in onboarding_materials table
    const materialsToInsert = materialsData.materials.map((material: any) => ({
      studio_id: studioId,
      material_name: material.material_name,
      category: material.category,
      manufacturer_name: material.manufacturer_name,
      notes: material.notes,
      processed: false,
    }));

    const { data: insertedMaterials, error: insertError } = await supabase
      .from('onboarding_materials')
      .insert(materialsToInsert)
      .select();

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        materialsCount: materialsToInsert.length,
        materials: insertedMaterials,
        originalFilename: file.name,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error processing materials file:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
