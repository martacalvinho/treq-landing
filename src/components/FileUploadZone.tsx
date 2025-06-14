
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFileSelect, 
  acceptedTypes = ".csv,.pdf,.jpg,.jpeg,.png",
  maxSize = 10 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeTypeAllowed = allowedTypes.some(type => 
      type.startsWith('.') ? type === fileExtension : file.type.includes(type)
    );

    if (!mimeTypeAllowed) {
      alert(`File type not supported. Please upload: ${acceptedTypes}`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-coral-500 bg-coral-50' 
            : 'border-coral-300 hover:border-coral-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FileText className="h-12 w-12 text-coral-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop your file here or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supported formats: PDF, Images (JPG, PNG), CSV files up to {maxSize}MB
        </p>
        <Button 
          className="bg-coral hover:bg-coral-600"
          onClick={handleButtonClick}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
