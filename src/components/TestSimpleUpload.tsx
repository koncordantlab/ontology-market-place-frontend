import React, { useState } from 'react';
import { cloudinaryWidgetService, CloudinaryWidgetResult } from '../services/cloudinaryWidgetService';

const TestSimpleUpload: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUploadClick = async () => {
    try {
      setUploadStatus('Initializing widget...');
      
      await cloudinaryWidgetService.initialize({
        sources: ['local'],
        multiple: false,
        maxFiles: 1,
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        folder: 'test-uploads',
        tags: ['test'],
        onSuccess: (result: CloudinaryWidgetResult) => {
          console.log('Upload successful:', result);
          setUploadedImage(result.info.secure_url);
          setUploadStatus('Upload successful!');
        },
        onError: (error: any) => {
          console.error('Upload failed:', error);
          setUploadStatus(`Upload failed: ${error.message || error.status}`);
        },
        onClose: () => {
          setUploadStatus('Widget closed');
        }
      });

      setUploadStatus('Opening widget...');
      cloudinaryWidgetService.open();
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Simple Upload Test</h2>
      
      <div className="mb-4">
        <button
          onClick={handleUploadClick}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Upload
        </button>
      </div>

      {uploadStatus && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">{uploadStatus}</p>
        </div>
      )}

      {uploadedImage && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Uploaded Image:</h3>
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="w-full h-32 object-cover rounded"
          />
          <p className="text-xs text-gray-500 mt-1">{uploadedImage}</p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>This test uses the simple upload preset approach.</p>
        <p>Make sure you have created an upload preset named "ml_default" in your Cloudinary console.</p>
      </div>
    </div>
  );
};

export default TestSimpleUpload;
