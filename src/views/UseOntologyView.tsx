import React, { useState, useEffect } from 'react';
import { GraphVisualization } from '../components/GraphVisualization';
import { Neo4jGraphVisualization } from '../components/Neo4jGraphVisualization';
import { DatabaseConnectionForm } from '../components/DatabaseConnectionForm';
import { Toggle } from '../components/Toggle';
import { OntologySelector } from '../components/OntologySelector';
import { neo4jService, Neo4jCredentials, Neo4jGraph } from '../services/neo4jService';

interface UseOntologyViewProps {
  onNavigate: (view: string, ontologyId?: string) => void;
}

export const UseOntologyView: React.FC<UseOntologyViewProps> = ({ onNavigate }) => {
  const [showMerged, setShowMerged] = useState(true);
  const [selectedOntologyId, setSelectedOntologyId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [neo4jGraph, setNeo4jGraph] = useState<Neo4jGraph | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);

  useEffect(() => {
    // Check if already connected on component mount
    setIsConnected(neo4jService.isConnected());
  }, []);

  const handleConnect = async (credentials: Neo4jCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Connection is handled in DatabaseConnectionForm
      setIsConnected(true);
      
      // Fetch initial graph data
      const graphData = await neo4jService.getGraphData(50);
      setNeo4jGraph(graphData);
      
      // Get database info
      const info = await neo4jService.getDatabaseInfo();
      setDbInfo(info);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await neo4jService.disconnect();
      setIsConnected(false);
      setNeo4jGraph(null);
      setDbInfo(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    }
  };

  const handleRefreshData = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      const graphData = await neo4jService.getGraphData(50);
      setNeo4jGraph(graphData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    if (!selectedOntologyId) {
      alert('Please select an ontology first');
      return;
    }
    if (!isConnected) {
      alert('Please connect to a database first');
      return;
    }
    console.log('Uploading ontology to database');
    // Implement upload logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selected Ontology Panel */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SELECTED ONTOLOGY</h2>
            
            <OntologySelector
              selectedId={selectedOntologyId}
              onSelect={setSelectedOntologyId}
              onNavigate={onNavigate}
            />
            
            {selectedOntologyId && (
              <div className="mt-4">
                <GraphVisualization className="h-80" />
              </div>
            )}
          </div>

          {/* Target Neo4j Database Panel */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">TARGET NEO4J DATABASE</h2>
            
            {isConnected ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Connected to Neo4j Database
                      </p>
                      {dbInfo && (
                        <p className="text-xs text-green-600">
                          {dbInfo.nodeCount} nodes, {dbInfo.relationshipCount} relationships
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleRefreshData}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'LOADING...' : 'REFRESH'}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    DISCONNECT
                  </button>
                </div>
              </div>
            ) : (
              <DatabaseConnectionForm 
                onConnect={handleConnect}
                onConnectionSuccess={() => {}}
                onConnectionError={(error) => setError(error)}
              />
            )}
          </div>

          {/* Merged Data Model Preview Panel */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">DATA MODEL PREVIEW</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isConnected ? 'LIVE NEO4J DATA' : 'MOCK DATA MODEL'}
                </p>
              </div>
            </div>
            
            {isConnected && neo4jGraph ? (
              <Neo4jGraphVisualization
                nodes={neo4jGraph.nodes}
                relationships={neo4jGraph.relationships}
                className="h-64 mb-6"
                onNodeClick={(node) => console.log('Selected node:', node)}
              />
            ) : (
              <GraphVisualization className="h-64 mb-6" />
            )}
            
            <div className="flex items-center justify-between">
              <Toggle
                checked={showMerged}
                onChange={setShowMerged}
                label="Show Merged"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedOntologyId || !isConnected}
                className={`px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                  selectedOntologyId && isConnected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                UPLOAD
              </button>
            </div>
            
            {(!selectedOntologyId || !isConnected) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  {!selectedOntologyId && !isConnected
                    ? 'Select an ontology and connect to database to upload'
                    : !selectedOntologyId
                    ? 'Select an ontology to upload'
                    : 'Connect to database to upload'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};