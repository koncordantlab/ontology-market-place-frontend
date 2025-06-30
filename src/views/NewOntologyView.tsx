import React, { useState } from 'react';
import { RotateCcw, Plus, Link } from 'lucide-react';
import { GraphVisualization } from '../components/GraphVisualization';
import { FileDropZone } from '../components/FileDropZone';
import { OntologyMixPanel } from '../components/OntologyMixPanel';

interface NewOntologyViewProps {
  onNavigate: (view: string, ontologyId?: string) => void;
}

export const NewOntologyView: React.FC<NewOntologyViewProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleFileSelect = (file: File) => {
    console.log('File selected for new ontology:', file.name);
    // Implement file processing logic
  };

  const handleSave = () => {
    console.log('Saving new ontology:', { title, description, tags });
    // Implement save logic
  };

  const handlePublish = () => {
    console.log('Publishing new ontology:', { title, description, tags });
    // Implement publish logic
    const newOntologyId = Date.now().toString(); // Generate temporary ID
    onNavigate('ontology-details', newOntologyId);
  };

  const handleUndo = () => {
    console.log('Undo last action');
    // Implement undo logic
  };

  const handleAddNode = () => {
    console.log('Adding new node');
    // Implement add node logic
  };

  const handleLinkNodes = () => {
    console.log('Linking nodes');
    // Implement link nodes logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Import/Mix */}
          <div className="lg:col-span-3 space-y-6">
            {/* Import Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">IMPORT</h2>
              <FileDropZone
                onFileSelect={handleFileSelect}
                title="Drop csv, txt, owl, rdf file here"
                acceptedFileTypes=".csv,.txt,.owl,.rdf"
                className="mb-6"
              />
            </div>

            {/* Mix Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">MIX</h2>
              <OntologyMixPanel />
            </div>
          </div>

          {/* Center Panel - Editable Graph */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">EDITABLE GRAPH VIEW</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUndo}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    title="Undo"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleAddNode}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    title="Add Node"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleLinkNodes}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    title="Link Nodes"
                  >
                    <Link className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Empty state or graph */}
              <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-lg mb-2">Start Building Your Ontology</div>
                  <div className="text-gray-500 text-sm">
                    Import files, mix existing ontologies, or add nodes manually
                  </div>
                </div>
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
                
                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    SAVE
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