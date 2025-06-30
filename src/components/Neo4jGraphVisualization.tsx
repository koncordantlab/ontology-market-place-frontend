import React, { useEffect, useState } from 'react';
import { Neo4jNode, Neo4jRelationship } from '../services/neo4jService';

interface Neo4jGraphVisualizationProps {
  nodes: Neo4jNode[];
  relationships: Neo4jRelationship[];
  width?: number;
  height?: number;
  className?: string;
  onNodeClick?: (node: Neo4jNode) => void;
}

export const Neo4jGraphVisualization: React.FC<Neo4jGraphVisualizationProps> = ({
  nodes,
  relationships,
  width = 600,
  height = 400,
  className = '',
  onNodeClick
}) => {
  const [selectedNode, setSelectedNode] = useState<Neo4jNode | null>(null);

  const handleNodeClick = (node: Neo4jNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  };

  const getNodeColor = (labels: string[]) => {
    const colorMap: Record<string, string> = {
      'Person': '#3B82F6',
      'Company': '#10B981',
      'Product': '#F59E0B',
      'Location': '#EF4444',
      'Event': '#8B5CF6',
      'default': '#6B7280'
    };

    const primaryLabel = labels[0] || 'default';
    return colorMap[primaryLabel] || colorMap.default;
  };

  const getNodeSize = (node: Neo4jNode) => {
    // Size based on number of properties or connections
    const baseSize = 20;
    const propertyCount = Object.keys(node.properties).length;
    return Math.min(baseSize + propertyCount * 3, 40);
  };

  const getNodeLabel = (node: Neo4jNode) => {
    // Try to get a meaningful label from properties
    const nameProps = ['name', 'title', 'label', 'id'];
    for (const prop of nameProps) {
      if (node.properties[prop]) {
        return String(node.properties[prop]).substring(0, 15);
      }
    }
    return node.labels[0] || 'Node';
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <svg width={width} height={height} className="w-full h-full">
        {/* Render relationships first (behind nodes) */}
        {relationships.map(rel => {
          const startNode = nodes.find(n => n.id === rel.startNodeId);
          const endNode = nodes.find(n => n.id === rel.endNodeId);
          
          if (!startNode || !endNode) return null;
          
          return (
            <g key={rel.id}>
              <line
                x1={startNode.x}
                y1={startNode.y}
                x2={endNode.x}
                y2={endNode.y}
                stroke="#9CA3AF"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
              {/* Relationship label */}
              <text
                x={(startNode.x! + endNode.x!) / 2}
                y={(startNode.y! + endNode.y!) / 2 - 5}
                textAnchor="middle"
                className="text-xs fill-gray-600"
                fontSize="10"
              >
                {rel.type}
              </text>
            </g>
          );
        })}
        
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#9CA3AF"
            />
          </marker>
        </defs>
        
        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={getNodeSize(node)}
              fill={getNodeColor(node.labels)}
              stroke={selectedNode?.id === node.id ? "#1F2937" : "#FFFFFF"}
              strokeWidth={selectedNode?.id === node.id ? "3" : "2"}
              className="cursor-pointer transition-all duration-200 hover:stroke-gray-800"
              onClick={() => handleNodeClick(node)}
            />
            {/* Node label */}
            <text
              x={node.x}
              y={node.y! + getNodeSize(node) + 15}
              textAnchor="middle"
              className="text-xs fill-gray-700 pointer-events-none"
              fontSize="11"
            >
              {getNodeLabel(node)}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Node details panel */}
      {selectedNode && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Node Details</h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div><strong>Labels:</strong> {selectedNode.labels.join(', ')}</div>
            <div><strong>ID:</strong> {selectedNode.id}</div>
            {Object.entries(selectedNode.properties).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {String(value)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};