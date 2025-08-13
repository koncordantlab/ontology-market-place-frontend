import React, { useState } from 'react';
import { ChevronDown, Search, Plus, Loader } from 'lucide-react';

interface Ontology {
  id?: string;
  name: string;
  description: string;
  properties: {
    source_url?: string;
    image_url?: string;
    is_public: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
  ownerId?: string;
}

interface OntologySelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNavigate: (view: string, ontologyId?: string) => void;
  ontologies: Ontology[];
  isLoading?: boolean;
}

export const OntologySelector: React.FC<OntologySelectorProps> = ({
  selectedId,
  onSelect,
  onNavigate,
  ontologies,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOntology = ontologies.find(ont => ont.id === selectedId);
  
  const filteredOntologies = ontologies.filter(ontology => {
    const name = ontology.name || '';
    const description = ontology.description || '';
    const query = searchQuery.toLowerCase();
    
    return name.toLowerCase().includes(query) ||
           description.toLowerCase().includes(query);
  });

  const handleSelect = (ontologyId: string) => {
    onSelect(ontologyId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        <span className="text-sm text-gray-700 truncate">
          {selectedOntology ? (selectedOntology.name || 'Untitled Ontology') : 'Select an ontology...'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ontologies..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center px-3 py-4">
                <Loader className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading ontologies...</span>
              </div>
            ) : (
              filteredOntologies.map((ontology) => {
                // Safely handle potentially undefined properties
                const isPublic = ontology.properties?.is_public ?? false;
                const hasSource = !!ontology.properties?.source_url;
                
                return (
                  <button
                    key={ontology.id}
                    onClick={() => handleSelect(ontology.id!)}
                    className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200 ${
                      selectedId === ontology.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {ontology.properties?.image_url ? (
                          <img 
                            src={ontology.properties.image_url} 
                            alt={`${ontology.name} thumbnail`}
                            className="w-8 h-8 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.src = 'https://via.placeholder.com/32x32?text=📊';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{ontology.name || 'Untitled Ontology'}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{ontology.description || 'No description available'}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              isPublic 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {isPublic ? 'Public' : 'Private'}
                          </span>
                          {hasSource && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Has Source
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}

            {!isLoading && filteredOntologies.length === 0 && (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No ontologies found
              </div>
            )}

            {/* Create New Option */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => {
                  onNavigate('new-ontology');
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 text-sm text-blue-600 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Ontology
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};