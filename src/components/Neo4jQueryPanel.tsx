import React, { useState } from 'react';
import { neo4jService } from '../services/neo4jService';
import { Play, Download } from 'lucide-react';

interface Neo4jQueryPanelProps {
  onResultsChange?: (results: any[]) => void;
}

export const Neo4jQueryPanel: React.FC<Neo4jQueryPanelProps> = ({ onResultsChange }) => {
  const [query, setQuery] = useState('MATCH (n) RETURN n LIMIT 25');
  const [results, setResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async () => {
    if (!neo4jService.isConnected()) {
      setError('Not connected to Neo4j database');
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      const records = await neo4jService.executeCustomQuery(query);
      const formattedResults = records.map((record, index) => ({
        id: index,
        keys: record.keys,
        values: record.keys.map(key => {
          const value = record.get(key);
          if (value && typeof value === 'object' && value.identity) {
            // Neo4j node or relationship
            return {
              type: value.labels ? 'node' : 'relationship',
              id: value.identity.toString(),
              labels: value.labels || [],
              properties: value.properties || {},
              relationshipType: value.type || null
            };
          }
          return value;
        })
      }));

      setResults(formattedResults);
      onResultsChange?.(formattedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neo4j-query-results.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const commonQueries = [
    {
      name: 'All Nodes',
      query: 'MATCH (n) RETURN n LIMIT 25'
    },
    {
      name: 'All Relationships',
      query: 'MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 25'
    },
    {
      name: 'Node Labels',
      query: 'CALL db.labels()'
    },
    {
      name: 'Relationship Types',
      query: 'CALL db.relationshipTypes()'
    },
    {
      name: 'Database Schema',
      query: 'CALL db.schema.visualization()'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Neo4j Query Console</h3>
      
      {/* Common Queries */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Common Queries
        </label>
        <div className="flex flex-wrap gap-2">
          {commonQueries.map((item) => (
            <button
              key={item.name}
              onClick={() => setQuery(item.query)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="mb-4">
        <label htmlFor="cypher-query" className="block text-sm font-medium text-gray-700 mb-2">
          Cypher Query
        </label>
        <textarea
          id="cypher-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none font-mono text-sm"
          placeholder="Enter your Cypher query here..."
        />
      </div>

      {/* Execute Button */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={executeQuery}
          disabled={isExecuting || !neo4jService.isConnected()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-4 w-4" />
          <span>{isExecuting ? 'EXECUTING...' : 'EXECUTE'}</span>
        </button>
        
        {results.length > 0 && (
          <button
            onClick={exportResults}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>EXPORT</span>
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <div className="border border-gray-200 rounded-md">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">
              Results ({results.length} records)
            </h4>
          </div>
          <div className="max-h-96 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {results[0]?.keys.map((key: string) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((record) => (
                  <tr key={record.id}>
                    {record.values.map((value: any, index: number) => (
                      <td key={index} className="px-4 py-2 text-sm text-gray-900">
                        {typeof value === 'object' && value !== null ? (
                          <div className="space-y-1">
                            {value.type && (
                              <div className="text-xs text-blue-600">
                                {value.type}: {value.labels?.join(', ') || value.relationshipType}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {JSON.stringify(value.properties || value, null, 1)}
                            </div>
                          </div>
                        ) : (
                          String(value)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};