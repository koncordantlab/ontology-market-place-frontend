import React from 'react';
import { MoreHorizontal, Eye, Edit, Play } from 'lucide-react';
import { GraphVisualization } from './GraphVisualization';

interface Ontology {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  lastModified: string;
}

interface OntologyCardProps {
  ontology: Ontology;
  onView: () => void;
  onEdit: () => void;
  onUse: () => void;
}

export const OntologyCard: React.FC<OntologyCardProps> = ({
  ontology,
  onView,
  onEdit,
  onUse
}) => {
  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-pink-100 text-pink-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-indigo-100 text-indigo-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Thumbnail/Graph Preview */}
      <div className="p-4 border-b border-gray-100">
        <GraphVisualization width={280} height={120} className="rounded-md" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {ontology.title}
          </h3>
          <div className="relative ml-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {ontology.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {ontology.tags.map((tag, index) => (
            <span
              key={tag}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(index)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onView}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </button>
            <button
              onClick={onUse}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-xs font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Play className="h-3 w-3 mr-1" />
              Use
            </button>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(ontology.lastModified).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};