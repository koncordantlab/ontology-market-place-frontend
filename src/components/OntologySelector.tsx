import React, { useState } from 'react';
import { ChevronDown, Search, Plus } from 'lucide-react';

interface Ontology {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

interface OntologySelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNavigate: (view: string, ontologyId?: string) => void;
}

const mockOntologies: Ontology[] = [
  {
    id: '1',
    title: 'Medical Ontology',
    description: 'Comprehensive medical terminology',
    tags: ['Medical', 'Healthcare']
  },
  {
    id: '2',
    title: 'E-commerce Product Catalog',
    description: 'Product categorization system',
    tags: ['E-commerce', 'Retail']
  },
  {
    id: '3',
    title: 'Academic Research',
    description: 'Research paper classification',
    tags: ['Academic', 'Research']
  }
];

export const OntologySelector: React.FC<OntologySelectorProps> = ({
  selectedId,
  onSelect,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOntology = mockOntologies.find(ont => ont.id === selectedId);
  
  const filteredOntologies = mockOntologies.filter(ontology =>
    ontology.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ontology.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {selectedOntology ? selectedOntology.title : 'Select an ontology...'}
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
            {filteredOntologies.map((ontology) => (
              <button
                key={ontology.id}
                onClick={() => handleSelect(ontology.id)}
                className={`w-full text-left px-3 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200 ${
                  selectedId === ontology.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <div className="font-medium text-sm">{ontology.title}</div>
                <div className="text-xs text-gray-500 mt-1">{ontology.description}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ontology.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}

            {filteredOntologies.length === 0 && (
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