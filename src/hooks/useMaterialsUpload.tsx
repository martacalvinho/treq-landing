
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

      const response = await fetch('/functions/v1/process-materials-file', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "File processed successfully",
          description: `Extracted ${result.materialsCount} materials from ${result.originalFilename}`,
        });
      } else {
        toast({
          title: "Processing failed",
          description: result.error || "Failed to process the file",
          variant: "destructive",
        });
      }

      return result;
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
