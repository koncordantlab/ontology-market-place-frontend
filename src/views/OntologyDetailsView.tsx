import React, { useState } from 'react';
import { GraphVisualization } from '../components/GraphVisualization';
import { CommentSystem } from '../components/CommentSystem';

interface OntologyDetailsViewProps {
  ontologyId: string | null;
  onNavigate: (view: string, ontologyId?: string) => void;
}

export const OntologyDetailsView: React.FC<OntologyDetailsViewProps> = ({
  ontologyId,
  onNavigate
}) => {
  const [title, setTitle] = useState('Medical Ontology');
  const [description, setDescription] = useState('Comprehensive medical terminology and relationships for healthcare applications. This ontology includes detailed classifications of diseases, treatments, medications, and medical procedures.');
  const [tags, setTags] = useState('medical, healthcare, terminology, diseases');


  const handleUpload = () => {
    console.log('Uploading ontology to database:', ontologyId);
    // Navigate to use ontology view for database upload
    onNavigate('use-ontology', ontologyId);
  };

  const handleEdit = () => {
    onNavigate('edit-ontology', ontologyId || undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Details Panel */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">DETAILS</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900">
                  {title}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 min-h-[100px]">
                  {description}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <div className="flex flex-wrap gap-1">
                    {tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 pt-4">                
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  EDIT
                </button>
              </div>
            </div>
          </div>

          {/* Graph View Panel */}
          <div className="lg:col-span-6 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">READ-ONLY GRAPH VIEW</h2>
            <GraphVisualization width={600} height={400} className="h-96" />
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUpload}
                className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                UPLOAD TO DATABASE
              </button>
            </div>
          </div>

          {/* Comments Panel */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">COMMENTS</h2>
            </div>
            
            <CommentSystem />
            
            {/* Add Comment Form */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <textarea
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none text-sm"
              />
              <div className="mt-2 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};