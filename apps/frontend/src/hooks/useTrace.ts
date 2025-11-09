import { useState } from 'react';
import { fetchTrace } from '../services/api';

export interface Transfer {
  from: string;
  to: string;
  amount: number;
  mint: string;
  type: string;
}

export interface TrailNode {
  signature: string;
  timestamp: string | null;
  transfers: Transfer[];
  children: TrailNode[];
  parentAssetMint?: string;
  parentRecipient?: string;
}

export interface TraceResponse {
  success: boolean;
  depth: number;
  trail: TrailNode | null;
  error?: string;
}

export const useTrace = () => {
  const [trail, setTrail] = useState<TrailNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTrace = async (signature: string, depth: number = 4) => {
    setLoading(true);
    setError(null);
    setTrail(null);

    try {
      const response: TraceResponse = await fetchTrace(signature, depth);
      console.log('Trace response:', response);
      
      if (response.success) {
        if (response.trail) {
          setTrail(response.trail);
        } else {
          setError('Trace completed but no trail data found. The transaction may not have any child transactions.');
        }
      } else {
        setError(response.error || 'Trace failed - no trail data returned');
      }
    } catch (err: any) {
      console.error('Trace error details:', err);
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.message ||
        err.message || 
        'Failed to fetch trace';
      
      // More detailed error message
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Cannot connect to backend server. Make sure the backend is running on port 5000.');
      } else if (err.response?.status === 404) {
        setError('Transaction not found. Please check the signature.');
      } else if (err.response?.status === 500) {
        setError('Server error: ' + errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return { trail, loading, error, getTrace };
};
