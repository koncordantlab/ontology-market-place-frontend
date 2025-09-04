import React from 'react';
import { OntologyForm } from '../components/OntologyForm';

interface NewOntologyViewProps {
  onNavigate: (view: string, ontologyId?: string) => void;
}

export const NewOntologyView: React.FC<NewOntologyViewProps> = ({ onNavigate }) => {
  return (
    <OntologyForm
      mode="create"
      onNavigate={onNavigate}
    />
  );
};