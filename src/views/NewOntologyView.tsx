import React, { useState } from 'react';
import { Plus, ExternalLink, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { GraphVisualization } from '../components/GraphVisualization';
import { ontologyService } from '../services/ontologyService';

interface NewOntologyViewProps {
  onNavigate: (view: string, ontologyId?: string) => void;
}

export const NewOntologyView: React.FC<NewOntologyViewProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [ontologyUrl, setOntologyUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);


  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      setSaveError('Title and description are required');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      // For now, we'll use the thumbnail preview URL as the image URL
      // In a real implementation, you'd upload the file to a storage service first
      const imageUrl = thumbnailPreview || undefined;

      const result = await ontologyService.createOntology(
        title,
        description,
        isPublic,
        ontologyUrl || undefined,
        imageUrl
      );

      if (result.error) {
        setSaveError(result.error);
      } else if (result.ontology) {
        setSaveSuccess(true);
        // Navigate to the new ontology details after a short delay
        setTimeout(() => {
          onNavigate('ontology-details', result.ontology?.id);
        }, 1500);
      }
    } catch (error) {
      setSaveError('Failed to save ontology. Please try again.');
      console.error('Error saving ontology:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    // For now, publishing is the same as saving but with isPublic = true
    setIsPublic(true);
    await handleSave();
  };

  const handleThumbnailUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setThumbnailFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessUrl = async () => {
    if (!ontologyUrl.trim()) {
      setProcessError('Please enter a valid URL');
      return;
    }

    setIsProcessing(true);
    setProcessError('');

    try {
      // Create ontology directly from URL using add_ontology function
      const result = await ontologyService.createOntology(
        `Ontology from ${new URL(ontologyUrl).hostname}`, // Auto-generate name
        `Ontology imported from ${ontologyUrl}`, // Auto-generate description
        false, // isPublic - default to private
        ontologyUrl, // sourceUrl
        undefined // imageUrl - no thumbnail for URL imports
      );

      if (result.error) {
        setProcessError(result.error);
      } else if (result.ontology) {
        // Success! Show success message and navigate
        setProcessError(''); // Clear any previous errors
        console.log('Ontology created from URL:', result.ontology);
        
        // Navigate to the new ontology details
        setTimeout(() => {
          onNavigate('ontology-details', result.ontology?.id);
        }, 1000);
      }
      
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
          {/* Left Panel - Add from URL */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
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
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">ONTOLOGY THUMBNAIL</h2>
              </div>
              
              {/* Thumbnail Upload Area */}
              {thumbnailPreview ? (
                <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="mx-auto w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {thumbnailFile?.name}
                    </p>
                    <button
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
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
                        handleThumbnailUpload(file);
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
              )}
              
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
                    placeholder="Enter ontology title"
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
                    placeholder="Describe your ontology"
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

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Make this ontology public</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Public ontologies can be viewed by all users
                  </p>
                </div>
                
                {/* Success/Error Messages */}
                {saveSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-green-800">Ontology saved successfully!</p>
                  </div>
                )}

                {saveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-800">{saveError}</p>
                  </div>
                )}

                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                      isSaving
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isSaving ? 'SAVING...' : 'SAVE'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSaving}
                    className={`w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                      isSaving
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSaving ? 'PUBLISHING...' : 'PUBLISH'}
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