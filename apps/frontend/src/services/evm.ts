import { api } from './api';

export const evmService = {
  traceTransaction: async (txHash: string, chainId: number, depth: number = 4) => {
    const response = await api.get(`/evm/trace/${txHash}?chainId=${chainId}&depth=${depth}`);
    return response.data;
  },
};

