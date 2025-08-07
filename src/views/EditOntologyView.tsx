import React, { useState } from 'react';
import { Plus, ExternalLink, Loader } from 'lucide-react';
import { GraphVisualization } from '../components/GraphVisualization';

interface EditOntologyViewProps {
  ontologyId: string | null;
  onNavigate: (view: string, ontologyId?: string) => void;
}

export const EditOntologyView: React.FC<EditOntologyViewProps> = ({
  ontologyId,
  onNavigate
}) => {
  const [title, setTitle] = useState('Medical Ontology');
  const [description, setDescription] = useState('Comprehensive medical terminology and relationships');
  const [tags, setTags] = useState('medical, healthcare, terminology');
  const [ontologyUrl, setOntologyUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState('');


  const handleSave = () => {
    console.log('Saving ontology:', { title, description, tags });
    // Implement save logic
  };

  const handlePublish = () => {
    console.log('Publishing ontology:', { title, description, tags });
    // Implement publish logic
    onNavigate('ontology-details', ontologyId || 'new');
  };

  const handleProcessUrl = async () => {
    if (!ontologyUrl.trim()) {
      setProcessError('Please enter a valid URL');
      return;
    }

    setIsProcessing(true);
    setProcessError('');

    try {
      // TODO: Call serverless function to process the URL
      console.log('Processing URL:', ontologyUrl);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Update graph visualization with processed data
      console.log('URL processed successfully');
      
    } catch (error) {
      setProcessError('Failed to process URL. Please check the URL and try again.');
      console.error('Error processing URL:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Mix */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ADD FROM URL</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="ontology-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Ontology URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="ontology-url"
                      value={ontologyUrl}
                      onChange={(e) => setOntologyUrl(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="https://example.com/ontology.owl"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {processError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">{processError}</p>
                  </div>
                )}

                <div className="text-sm text-gray-600 space-y-2">
                  <p className="font-medium">Supported formats:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>OWL (Web Ontology Language)</li>
                    <li>RDF (Resource Description Framework)</li>
                    <li>TTL (Turtle)</li>
                    <li>JSON-LD</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Editable Graph */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">ONTOLOGY THUMBNAIL</h2>
              </div>
              
              {/* Thumbnail Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Upload Thumbnail Image</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag and drop an image here, or click to browse
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    Supports: JPG, PNG, GIF (Max 5MB)
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="thumbnail-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('Thumbnail uploaded:', file.name);
                      // TODO: Handle thumbnail upload
                    }
                  }}
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200"
                >
                  Choose File
                </label>
              </div>
              
              {/* Add from URL Button - Centered */}
              <div className="flex justify-center">
                <button
                  onClick={handleProcessUrl}
                  disabled={isProcessing || !ontologyUrl.trim()}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                    isProcessing || !ontologyUrl.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>ADD FROM URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">DETAILS</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Comma-separated tags"
                  />
                </div>
                
                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    SAVE / UPDATE
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    PUBLISH
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};