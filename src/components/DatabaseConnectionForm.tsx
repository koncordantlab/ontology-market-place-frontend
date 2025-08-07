import React, { useState } from 'react';
import { neo4jService, Neo4jCredentials } from '../services/neo4jService';

interface DatabaseConnectionFormProps {
  onConnect: (credentials: Neo4jCredentials) => void;
  onConnectionSuccess?: () => void;
  onConnectionError?: (error: string) => void;
}

export const DatabaseConnectionForm: React.FC<DatabaseConnectionFormProps> = ({ 
  onConnect, 
  onConnectionSuccess,
  onConnectionError 
}) => {
  const [uri, setUri] = useState('bolt://localhost:7687');
  const [username, setUsername] = useState('neo4j');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    const credentials = { uri, username, password };

    try {
      await neo4jService.connect(credentials);
      onConnect(credentials);
      onConnectionSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      onConnectionError?.(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };


  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="uri" className="block text-sm font-medium text-gray-700 mb-2">
            URI
          </label>
          <input
            type="text"
            id="uri"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="bolt://localhost:7687"
            required
          />
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="neo4j"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isConnecting}
          className={`w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
            isConnecting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isConnecting ? 'CONNECTING...' : 'CONNECT'}
        </button>
      </form>
    </div>
  );
};