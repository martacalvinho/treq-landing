
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  success: boolean;
  materialsCount?: number;
  materials?: any[];
  originalFilename?: string;
  error?: string;
}

export const useMaterialsUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, studioId: string): Promise<UploadResult> => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studioId', studioId);

      const { data, error } = await supabase.functions.invoke('process-materials-file', {
        body: formData,
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Processing failed",
          description: error.message || "Failed to process the file",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      if (data?.success) {
        toast({
          title: "File processed successfully",
          description: `Extracted ${data.materialsCount} materials from ${data.originalFilename}`,
        });
      } else {
        toast({
          title: "Processing failed",
          description: data?.error || "Failed to process the file",
          variant: "destructive",
        });
      }

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = 'Failed to upload and process file';
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
  };
};
