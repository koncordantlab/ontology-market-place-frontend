import React, { useState } from 'react';
import { Plus, ExternalLink, Loader, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { GraphVisualization } from '../components/GraphVisualization';
import { ThumbnailUpload } from '../components/ThumbnailUpload';
import { FirebaseFunctionCaller } from '../config/firebaseFunctions';
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
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const handleCreateOntology = async () => {
    if (!title.trim() || !description.trim()) {
      setCreateError('Title and description are required');
      return;
    }

    setIsCreating(true);
    setCreateError('');
    setCreateSuccess(false);

    try {
      let finalTitle = title;
      let finalDescription = description;
      let finalThumbnailUrl = thumbnailUrl;

      // If URL is provided, process it first
      if (ontologyUrl.trim()) {
        setIsProcessing(true);
        try {
          const processResult = await FirebaseFunctionCaller.processOntologyUrl(ontologyUrl, false);
          
          // Use processed data if available, otherwise keep user input
          finalTitle = processResult.name || title;
          finalDescription = processResult.description || description;
          finalThumbnailUrl = processResult.thumbnailUrl || thumbnailUrl;
          
          setTitle(finalTitle);
          setDescription(finalDescription);
          if (processResult.thumbnailUrl) {
            setThumbnailUrl(processResult.thumbnailUrl);
          }
                 } catch (error) {
           // Continue with user input if URL processing fails
        } finally {
          setIsProcessing(false);
        }
      }

      const result = await ontologyService.createOntology(
        finalTitle,
        finalDescription,
        isPublic,
        ontologyUrl || undefined,
        finalThumbnailUrl || undefined
      );

      if (result.error) {
        setCreateError(result.error);
      } else if (result.ontology) {
        setCreateSuccess(true);
        // Navigate to the new ontology details after a short delay
        setTimeout(() => {
          onNavigate('ontology-details', result.ontology?.id);
        }, 1500);
      }
    } catch (error) {
      setCreateError('Failed to create ontology. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleThumbnailUploaded = (url: string) => {
    setThumbnailUrl(url);
  };

  const handleThumbnailError = (error: string) => {
    setCreateError(`Thumbnail upload failed: ${error}`);
  };

  const isFormValid = title.trim() && description.trim();
  const isProcessingOrCreating = isProcessing || isCreating;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Ontology</h1>
            <p className="text-gray-600 mt-2">Create a new ontology or import from URL</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
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
                  Description *
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
                <label htmlFor="ontology-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Source URL (Optional)
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
                <p className="text-xs text-gray-500 mt-1">
                  Supported: OWL, RDF, TTL, JSON-LD formats
                </p>
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
            </div>

            {/* Right Column - Thumbnail and Create Button */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail (Optional)
                </label>
                <ThumbnailUpload
                  onThumbnailUploaded={handleThumbnailUploaded}
                  onError={handleThumbnailError}
                />
              </div>

              {/* Success/Error Messages */}
              {createSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800">Ontology created successfully!</p>
                </div>
              )}

              {createError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-800">{createError}</p>
                </div>
              )}

              {/* Create Button */}
              <button
                type="button"
                onClick={handleCreateOntology}
                disabled={!isFormValid || isProcessingOrCreating}
                className={`w-full px-6 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  !isFormValid || isProcessingOrCreating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessingOrCreating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>{isProcessing ? 'PROCESSING...' : 'CREATING...'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>CREATE ONTOLOGY</span>
                  </>
                )}
              </button>

              <div className="text-xs text-gray-500 text-center">
                {isPublic ? 'This ontology will be published publicly' : 'This ontology will be saved as private'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};