import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { GraphVisualization } from './GraphVisualization';

interface MixOntology {
  id: string;
  title: string;
  description: string;
}

const mockMixOntologies: MixOntology[] = [
  {
    id: '1',
    title: 'Base Medical Terms',
    description: 'Core medical terminology'
  },
  {
    id: '2',
    title: 'Pharmaceutical Data',
    description: 'Drug and medication ontology'
  }
];

export const OntologyMixPanel: React.FC = () => {
  const [selectedOntologies, setSelectedOntologies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddOntology = (ontologyId: string) => {
    if (!selectedOntologies.includes(ontologyId)) {
      setSelectedOntologies([...selectedOntologies, ontologyId]);
    }
  };

  const handleRemoveOntology = (ontologyId: string) => {
    setSelectedOntologies(selectedOntologies.filter(id => id !== ontologyId));
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ontologies to mix..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      {/* Available Ontologies */}
      <div className="space-y-2">
        {mockMixOntologies
          .filter(ont => ont.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((ontology) => (
            <div
              key={ontology.id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {ontology.title}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {ontology.description}
                  </p>
                </div>
                <button
                  onClick={() => handleAddOntology(ontology.id)}
                  disabled={selectedOntologies.includes(ontology.id)}
                  className={`ml-2 p-1 rounded-full transition-colors duration-200 ${
                    selectedOntologies.includes(ontology.id)
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-2">
                <GraphVisualization width={200} height={80} className="rounded" />
              </div>
            </div>
          ))}
      </div>

      {/* Selected Ontologies */}
      {selectedOntologies.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Selected for Mixing ({selectedOntologies.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedOntologies.map((id) => {
              const ontology = mockMixOntologies.find(ont => ont.id === id);
              return ontology ? (
                <span
                  key={id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {ontology.title}
                  <button
                    onClick={() => handleRemoveOntology(id)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};