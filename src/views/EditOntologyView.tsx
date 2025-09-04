import React, { useState, useEffect } from 'react';
import { ontologyService, Ontology } from '../services/ontologyService';
import { OntologyForm } from '../components/OntologyForm';

interface EditOntologyViewProps {
  ontologyId: string | null;
  onNavigate: (view: string, ontologyId?: string) => void;
}

export const EditOntologyView: React.FC<EditOntologyViewProps> = ({
  ontologyId,
  onNavigate
}) => {
  const [ontology, setOntology] = useState<Ontology | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOntology = async () => {
      if (!ontologyId) {
        setError('No ontology ID provided');
        setIsLoading(false);
        return;
      }

      console.log('Loading ontology with ID:', ontologyId);
      console.log('ID type:', typeof ontologyId);
      console.log('ID length:', ontologyId?.length);

      try {
        const result = await ontologyService.getOntology(ontologyId);
        console.log('getOntology result:', result);
        
        if (result.success && result.data) {
          setOntology(result.data);
        } else {
          setError(result.error || 'Failed to load ontology');
        }
      } catch (err) {
        setError('Failed to load ontology');
        console.error('Error loading ontology:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOntology();
  }, [ontologyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ontology...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Ontology</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!ontology) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ontology Not Found</h2>
          <p className="text-gray-600 mb-4">The requested ontology could not be found.</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <OntologyForm
      mode="edit"
      ontologyId={ontologyId}
      initialData={ontology}
      onNavigate={onNavigate}
    />
  );
};