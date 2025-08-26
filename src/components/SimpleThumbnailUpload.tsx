import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { simpleUploadService, SimpleUploadResult } from '../services/simpleUploadService';

interface SimpleThumbnailUploadProps {
  onThumbnailUploaded: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export const SimpleThumbnailUpload: React.FC<SimpleThumbnailUploadProps> = ({
  onThumbnailUploaded,
  onError,
  className = '',
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select a valid image file';
      setUploadError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'Image size must be less than 5MB';
      setUploadError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(25);
      setUploadError(null);



      const result: SimpleUploadResult = await simpleUploadService.uploadThumbnail(file);

      if (result.success && result.url) {

        setPreviewUrl(result.url);
        onThumbnailUploaded(result.url);
        setUploadProgress(100);
        setUploadError(null);
      } else {
        const errorMsg = result.error || 'Upload failed';

        setUploadError(errorMsg);
        onError?.(errorMsg);
        setUploadProgress(0);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';

      setUploadError(errorMsg);
      onError?.(errorMsg);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const clearThumbnail = () => {
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onThumbnailUploaded('');
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Error Display */}
      {uploadError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {uploadError}
          <button
            onClick={() => setUploadError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Thumbnail Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
            />
            {!isUploading && (
              <button
                onClick={clearThumbnail}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Controls */}
      <div className="space-y-3">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={disabled || isUploading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* Help text */}
        <p className="text-xs text-gray-500">
          Upload an image for your ontology thumbnail. 
          Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
          <span className="block mt-1 text-blue-600">
            💡 This uses direct upload - no widget needed!
          </span>
        </p>
      </div>
    </div>
  );
};
