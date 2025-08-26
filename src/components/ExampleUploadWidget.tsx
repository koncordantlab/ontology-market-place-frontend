import React, { useState } from 'react';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { CloudinaryWidgetResult } from '../services/cloudinaryWidgetService';

/**
 * Example component demonstrating Cloudinary Upload Widget usage
 * This works without knowing your cloud name upfront!
 */
const ExampleUploadWidget: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUploadSuccess = (result: CloudinaryWidgetResult) => {
    console.log('Upload successful:', result);
    setUploadedImage(result.info.secure_url);
    setUploadStatus('Upload successful!');
  };

  const handleUploadError = (error: any) => {
    console.error('Upload failed:', error);
    setUploadStatus('Upload failed: ' + (error.message || 'Unknown error'));
  };

  const handleWidgetClose = () => {
    console.log('Widget closed');
    setUploadStatus('Widget closed');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cloudinary Upload Widget Example</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-4">
          This example uses Cloudinary's Upload Widget which works without knowing your cloud name!
          The cloud name is determined automatically by the upload preset.
        </p>
        
        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You'll need to create an upload preset named "ml_default" 
            in your Cloudinary console for this to work. See the setup guide for instructions.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <CloudinaryUploadWidget
          uploadPreset="ml_default" // This is the default preset name
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onClose={handleWidgetClose}
          buttonText="Upload Image"
          buttonClassName="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        />
      </div>

      {uploadStatus && (
        <div className={`p-3 rounded mb-4 ${
          uploadStatus.includes('successful') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {uploadStatus}
        </div>
      )}

      {uploadedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="w-full h-48 object-cover rounded border"
          />
          <div className="mt-2">
            <p className="text-sm text-gray-600">Image URL:</p>
            <p className="text-xs text-gray-500 break-all">{uploadedImage}</p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• The Upload Widget loads Cloudinary's script automatically</li>
          <li>• Cloud name is determined by the upload preset</li>
          <li>• No need to know your cloud name upfront</li>
          <li>• Built-in file validation and preview</li>
          <li>• Supports drag & drop, camera, and URL uploads</li>
        </ul>
      </div>
    </div>
  );
};

export default ExampleUploadWidget;
