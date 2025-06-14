
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

    // Get file content
    const arrayBuffer = await file.arrayBuffer();
    const fileType = file.type;
    const fileName = file.name;
    
    let extractedText = '';
    let imageBase64 = '';

    console.log(`Processing file: ${fileName}, type: ${fileType}, size: ${file.size}`);

    // Handle different file types
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      // For CSV files, convert to text directly
      extractedText = new TextDecoder().decode(arrayBuffer);
      console.log('CSV content preview:', extractedText.substring(0, 500));
    } else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      // For images, convert to base64 for vision model
      imageBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      console.log('Image converted to base64, length:', imageBase64.length);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // For PDFs, we'll send the base64 content and let AI try to extract text
      imageBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      console.log('PDF converted to base64 for AI processing, length:', imageBase64.length);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Create AI prompt
    let prompt = '';
    let messages = [];

    if (extractedText) {
      // Text-based content (CSV)
      prompt = `
You are an expert at extracting material schedule data from construction/interior design documents.

I have uploaded a material schedule document with the following content:

${extractedText}

CRITICAL INSTRUCTIONS:
1. Extract ONLY the materials that are explicitly listed in this document
2. Do NOT create, invent, or add any materials that are not in the original document
3. Use the EXACT names as written in the document
4. If you cannot find clear materials in the document, return an empty materials array

Please extract all materials and return them in this exact JSON format:
{
  "materials": [
    {
      "material_name": "exact name from document",
      "category": "categorize as one of: Flooring, Wall Covering, Ceiling, Window Treatment, Furniture, Lighting, Plumbing, Hardware, Surface, Textile, Other",
      "manufacturer_name": "manufacturer name if available, or null",
      "notes": "any additional specifications, dimensions, colors, finishes, etc. from the document"
    }
  ]
}

Return valid JSON only, no other text.
`;

      messages = [
        {
          role: 'user',
          content: prompt
        }
      ];
    } else if (imageBase64) {
      // Image or PDF content
      prompt = `
You are an expert at extracting material schedule data from construction/interior design documents.

I have uploaded a material schedule document (image or PDF). Please carefully read and extract all materials listed in this document.

CRITICAL INSTRUCTIONS:
1. Extract ONLY the materials that are explicitly visible/readable in this document
2. Do NOT create, invent, or add any materials that are not in the original document
3. Use the EXACT names as written in the document
4. If the image is unclear or you cannot read materials clearly, return an empty materials array
5. Look for tables, lists, or schedules that contain material information

Please extract all materials and return them in this exact JSON format:
{
  "materials": [
    {
      "material_name": "exact name from document",
      "category": "categorize as one of: Flooring, Wall Covering, Ceiling, Window Treatment, Furniture, Lighting, Plumbing, Hardware, Surface, Textile, Other",
      "manufacturer_name": "manufacturer name if available, or null",
      "notes": "any additional specifications, dimensions, colors, finishes, etc. from the document"
    }
  ]
}

Return valid JSON only, no other text.
`;

      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${fileType};base64,${imageBase64}`
              }
            }
          ]
        }
      ];
    }

    console.log('Sending request to OpenRouter...');

    // Call OpenRouter API with vision model for images/PDFs
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://specclarity.app',
        'X-Title': 'SpecClarity Material Extraction',
      },
      body: JSON.stringify({
        model: imageBase64 ? 'openai/gpt-4o' : 'deepseek/deepseek-r1-0528:free',
        messages: messages,
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const aiResponse = await response.json();
    console.log('AI response received:', JSON.stringify(aiResponse, null, 2));

    const extractedContent = aiResponse.choices[0].message.content;
    console.log('Extracted content:', extractedContent);

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
      console.error('Parse error:', parseError);
      throw new Error('Failed to parse materials data from AI response');
    }

    console.log('Parsed materials data:', materialsData);

    if (!materialsData.materials || !Array.isArray(materialsData.materials)) {
      throw new Error('Invalid materials data structure');
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

    console.log('Inserting materials:', materialsToInsert);

    const { data: insertedMaterials, error: insertError } = await supabase
      .from('onboarding_materials')
      .insert(materialsToInsert)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log('Successfully inserted materials:', insertedMaterials);

    return new Response(
      JSON.stringify({
        success: true,
        materialsCount: materialsToInsert.length,
        materials: insertedMaterials,
        originalFilename: fileName,
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
