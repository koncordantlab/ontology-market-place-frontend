import React from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
}

interface GraphVisualizationProps {
  nodes?: Node[];
  width?: number;
  height?: number;
  className?: string;
}

const defaultNodes: Node[] = [
  { id: '1', x: 150, y: 100, size: 40, connections: ['2', '3'] },
  { id: '2', x: 300, y: 80, size: 60, connections: ['1', '4', '5'] },
  { id: '3', x: 120, y: 200, size: 30, connections: ['1', '6'] },
  { id: '4', x: 400, y: 150, size: 25, connections: ['2'] },
  { id: '5', x: 350, y: 250, size: 35, connections: ['2', '6'] },
  { id: '6', x: 200, y: 280, size: 30, connections: ['3', '5'] },
  { id: '7', x: 80, y: 150, size: 20, connections: ['3'] },
  { id: '8', x: 450, y: 200, size: 25, connections: ['4'] },
];

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes = defaultNodes,
  width = 500,
  height = 350,
  className = ''
}) => {
  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <svg width={width} height={height} className="w-full h-full">
        {/* Render connections first (behind nodes) */}
        {nodes.map(node =>
          node.connections.map(connectionId => {
            const connectedNode = nodes.find(n => n.id === connectionId);
            if (!connectedNode) return null;
            
            return (
              <line
                key={`${node.id}-${connectionId}`}
                x1={node.x}
                y1={node.y}
                x2={connectedNode.x}
                y2={connectedNode.y}
                stroke="#374151"
                strokeWidth="3"
                className="transition-colors duration-200"
              />
            );
          })
        )}
        
        {/* Render nodes */}
        {nodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill={node.size > 50 ? "#ffffff" : "#ffffff"}
            stroke="#1f2937"
            strokeWidth="4"
            className="cursor-pointer transition-all duration-200 hover:fill-blue-50 hover:stroke-blue-500"
          />
        ))}
      </svg>
    </div>
  );
};