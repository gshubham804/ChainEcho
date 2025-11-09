import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrace } from '../hooks/useTrace';
import { GraphFlow } from '../components/GraphFlow';
import { Loader } from '../components/Loader';

export default function TraceResult() {
  const { signature } = useParams<{ signature: string }>();
  const navigate = useNavigate();
  const { trail, loading, error, getTrace } = useTrace();

  useEffect(() => {
    if (signature) {
      getTrace(signature, 4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return (
    <div className="min-h-screen p-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-white/90 hover:text-white flex items-center gap-2 group transition-all"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Home</span>
        </button>

        {signature && (
          <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-white/80 text-sm mb-1">Tracing Signature</div>
            <div className="text-white font-mono text-sm break-all">{signature}</div>
          </div>
        )}

        {loading && (
          <div className="animate-fade-in">
            <Loader />
          </div>
        )}

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

        {trail && !loading && (
          <div className="animate-fade-in">
            <GraphFlow trail={trail} />
          </div>
        )}
      </div>
    </div>
  );
}

