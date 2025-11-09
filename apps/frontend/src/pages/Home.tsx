import React, { useState } from 'react';
import { useTrace } from '../hooks/useTrace';
import { GraphFlow } from '../components/GraphFlow';
import { Loader } from '../components/Loader';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [signature, setSignature] = useState('');
  const { trail, loading, error, getTrace } = useTrace();

  const handleSearch = (sig: string) => {
    setSignature(sig);
    getTrace(sig, 4);
  };

  return (
    <div className="min-h-screen p-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block mb-4">
            <h1 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-lg">
              ChainEcho
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-white/95 text-xl font-medium mt-4">
            Multi-chain Transaction Tracer
          </p>
          <p className="text-white/80 text-sm mt-2">
            Trace Solana & EVM transactions across the blockchain
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 animate-slide-up">
          <div className="mb-4">
            <label className="block text-white/90 text-sm font-semibold mb-2">
              Transaction Signature
            </label>
          </div>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="animate-fade-in">
            <Loader />
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 text-red-100 px-6 py-4 rounded-xl mb-6 shadow-lg animate-shake">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-lg mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {trail && !loading && (
          <div className="animate-fade-in">
            <GraphFlow trail={trail} />
          </div>
        )}

        {/* Empty State */}
        {!trail && !loading && !error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-white/90 text-lg font-medium mb-2">
                Ready to trace transactions
              </p>
              <p className="text-white/70 text-sm">
                Enter a Solana transaction signature above to start
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
