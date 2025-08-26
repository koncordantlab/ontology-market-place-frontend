import React, { useEffect, useRef, useState } from 'react';
import { cloudinaryWidgetService, CloudinaryWidgetResult } from '../services/cloudinaryWidgetService';

interface CloudinaryUploadWidgetProps {
  uploadPreset?: string;
  onUploadSuccess?: (result: CloudinaryWidgetResult) => void;
  onUploadError?: (error: any) => void;
  onClose?: () => void;
  buttonText?: string;
  buttonClassName?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Cloudinary Upload Widget Component
 * 
 * This component uses Cloudinary's Upload Widget which can work without
 * knowing the cloud name upfront. The cloud name is determined by the upload preset.
 * 
 * Based on Cloudinary documentation:
 * https://cloudinary.com/documentation/upload_widget#upload_preset_selection
 */
const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  uploadPreset = 'ml_default',
  onUploadSuccess,
  onUploadError,
  onClose,
  buttonText = 'Upload Image',
  buttonClassName = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50',
  disabled = false,
  children
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    initializeWidget();
    
    // Cleanup on unmount
    return () => {
      cloudinaryWidgetService.destroy();
    };
  }, [uploadPreset]);

  const initializeWidget = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await cloudinaryWidgetService.initialize({
        uploadPreset,
        sources: ['local', 'camera', 'url'],
        multiple: false,
        maxFiles: 1,
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        onSuccess: (result: CloudinaryWidgetResult) => {
          console.log('Upload successful:', result);
          onUploadSuccess?.(result);
        },
        onError: (error: any) => {
          console.error('Upload failed:', error);
          setError(error.message || 'Upload failed');
          onUploadError?.(error);
        },
        onClose: () => {
          console.log('Widget closed');
          onClose?.();
        }
      });
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize widget:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize upload widget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (!isInitialized || disabled) {
      return;
    }
    
    try {
      cloudinaryWidgetService.open();
    } catch (error) {
      console.error('Failed to open widget:', error);
      setError('Failed to open upload widget');
    }
  };

  return (
    <div className="cloudinary-upload-widget">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      
      <button
        ref={buttonRef}
        onClick={handleUploadClick}
        disabled={disabled || !isInitialized || isLoading}
        className={buttonClassName}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Initializing...
          </span>
        ) : (
          children || buttonText
        )}
      </button>
      
      {!isInitialized && !isLoading && (
        <p className="mt-2 text-sm text-gray-600">
          Upload widget is being initialized...
        </p>
      )}
    </div>
  );
};

export default CloudinaryUploadWidget;
