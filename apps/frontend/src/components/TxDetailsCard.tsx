import React from 'react';
import { TrailNode } from '../hooks/useTrace';
import { formatAddress, formatAmount, formatDate } from '../utils/formatters';

interface TxDetailsCardProps {
  node: TrailNode;
  level?: number;
}

const TxDetailsCard: React.FC<TxDetailsCardProps> = ({ node, level = 0 }) => {
  const getLevelColor = (level: number) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
    ];
    return colors[level % colors.length];
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all min-w-[420px] max-w-md group">
      {/* Header with gradient accent */}
      <div className={`h-1 bg-gradient-to-r ${getLevelColor(level)} rounded-t-xl -mt-5 -mx-5 mb-4`}></div>
      
      {/* Signature */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Signature</div>
        </div>
        <div className="text-sm font-mono text-gray-800 break-all bg-gray-50 p-2 rounded-lg border border-gray-200 group-hover:bg-gray-100 transition-colors">
          {formatAddress(node.signature, 12)}
        </div>
      </div>

      {/* Timestamp */}
      {node.timestamp && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timestamp</div>
          </div>
          <div className="text-sm text-gray-700 font-medium">{formatDate(node.timestamp)}</div>
        </div>
      )}

      {/* Transfers */}
      {node.transfers && node.transfers.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Transfers
              </div>
            </div>
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {node.transfers.length}
            </span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {node.transfers.map((transfer, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 text-sm">
                    {formatAmount(transfer.amount, transfer.mint)}
                  </span>
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">
                    {transfer.type}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">From:</span>
                    <span className="font-mono font-medium">{formatAddress(transfer.from, 8)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">To:</span>
                    <span className="font-mono font-medium">{formatAddress(transfer.to, 8)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Children count */}
      {node.children && node.children.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-gray-600 font-medium">
              {node.children.length} child transaction{node.children.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TxDetailsCard;

