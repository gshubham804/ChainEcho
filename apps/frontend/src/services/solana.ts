import { api } from './api';

export const solanaService = {
  traceTransaction: async (signature: string, depth: number = 4) => {
    const response = await api.get(`/solana/trace/${signature}?depth=${depth}`);
    return response.data;
  },
};

