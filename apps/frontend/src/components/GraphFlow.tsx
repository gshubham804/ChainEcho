import React, { useState } from 'react';
import { TrailNode } from '../hooks/useTrace';
import TxDetailsCard from './TxDetailsCard';

interface GraphFlowProps {
  trail: TrailNode;
}

export const GraphFlow: React.FC<GraphFlowProps> = ({ trail }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([trail.signature]));

  const toggleNode = (signature: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(signature)) {
      newExpanded.delete(signature);
    } else {
      newExpanded.add(signature);
    }
    setExpandedNodes(newExpanded);
  };

  const countNodes = (node: TrailNode): number => {
    return 1 + (node.children?.reduce((sum, child) => sum + countNodes(child), 0) || 0);
  };

  const getMaxDepth = (node: TrailNode, depth: number = 0): number => {
    if (!node.children || node.children.length === 0) return depth;
    return Math.max(...node.children.map(child => getMaxDepth(child, depth + 1)));
  };

  const totalNodes = countNodes(trail);
  const maxDepth = getMaxDepth(trail);

  const renderNode = (node: TrailNode, level: number = 0, isLast: boolean = true): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.signature);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.signature} className="relative">
        <div className="flex items-start gap-4 mb-4 animate-fade-in" style={{ animationDelay: `${level * 50}ms` }}>
          {/* Tree lines and connectors */}
          <div className="flex flex-col items-center relative">
            {/* Vertical line from parent */}
            {level > 0 && (
              <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gradient-to-b from-purple-400 to-pink-400 transform -translate-x-1/2"></div>
            )}
            
            {/* Horizontal line to node */}
            {level > 0 && (
              <div className="absolute top-0 left-1/2 w-4 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform -translate-x-full"></div>
            )}

            {/* Node connector circle */}
            <div className={`relative z-10 w-3 h-3 rounded-full border-2 ${
              level === 0 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-white' 
                : 'bg-white border-purple-400'
            } shadow-lg`}></div>

            {/* Vertical line to children */}
            {hasChildren && isExpanded && (
              <div className="absolute top-3 left-1/2 w-0.5 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400 transform -translate-x-1/2" 
                   style={{ height: `${(node.children!.length * 200) + 50}px` }}></div>
            )}
          </div>

          {/* Node content */}
          <div className="flex-1 min-w-0">
            {/* Depth indicator */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                Level {level + 1}
              </span>
              {hasChildren && (
                <button
                  onClick={() => toggleNode(node.signature)}
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Collapse
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Expand ({node.children!.length})
                    </>
                  )}
                </button>
              )}
            </div>

            <TxDetailsCard node={node} level={level} />

            {/* Children */}
            {hasChildren && isExpanded && (
              <div className="mt-6 ml-8 space-y-8">
                {node.children.map((child, idx) => (
                  <div key={child.signature} className="relative">
                    {renderNode(child, level + 1, idx === node.children!.length - 1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Transaction Trail Tree
            </h2>
            <div className="flex items-center gap-4 mt-2 text-white/90 text-sm">
              <span>{totalNodes} transaction{totalNodes !== 1 ? 's' : ''} traced</span>
              <span>•</span>
              <span>Depth: {maxDepth + 1} level{maxDepth !== 0 ? 's' : ''}</span>
            </div>
          </div>
          <button
            onClick={() => {
              const allSignatures = new Set<string>();
              const collectSignatures = (node: TrailNode) => {
                allSignatures.add(node.signature);
                node.children?.forEach(collectSignatures);
              };
              collectSignatures(trail);
              setExpandedNodes(allSignatures);
            }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Expand All
          </button>
        </div>
      </div>
      <div className="p-8 overflow-x-auto">
        <div className="max-w-full">
          {renderNode(trail)}
        </div>
      </div>
    </div>
  );
};
