import React, { useState } from 'react';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { CloudinaryWidgetResult } from '../services/cloudinaryWidgetService';

/**
 * Test component to verify Cloudinary Upload Widget functionality
 */
const TestUploadWidget: React.FC = () => {
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
      <h2 className="text-2xl font-bold mb-4">Test Cloudinary Upload Widget</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-4">
          This is a test component to verify the Cloudinary Upload Widget is working correctly.
        </p>
        
        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm text-blue-800">
            <strong>New Feature:</strong> The widget now uses <code>getUploadPresets</code> to automatically 
            discover available presets and determine your cloud name!
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded mb-4">
          <p className="text-sm text-green-800">
            <strong>✅ Ready to Test:</strong> The widget will show available presets when you click "Test Upload".
            If no presets exist, you can create one through the widget interface.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <CloudinaryUploadWidget
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onClose={handleWidgetClose}
          buttonText="Test Upload"
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
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Click "Test Upload" button</li>
          <li>Cloudinary widget should open with preset selection</li>
          <li>Select an available preset or create a new one</li>
          <li>Choose an image file to upload</li>
          <li>Widget should upload and return the URL</li>
          <li>Image should display below</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2 text-yellow-800">What's New:</h3>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>✅ Auto cloud name detection from presets</li>
          <li>✅ Dynamic preset discovery</li>
          <li>✅ Built-in preset creation interface</li>
          <li>✅ No manual cloud name configuration needed</li>
        </ul>
      </div>
    </div>
  );
};

export default TestUploadWidget;
