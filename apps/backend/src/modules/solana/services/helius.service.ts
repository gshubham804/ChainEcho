import axios from "axios";

// --- Configuration Setup (Constants for API URL) ---
// NOTE: In a real environment, HELIUS_API_KEY should be loaded securely from process.env
const network = "devnet"; // "devnet" or "mainnet"

export const HELIUS_BASE =
  network === "devnet"
    ? "https://api-devnet.helius.xyz/v0"
    : "https://api.helius.xyz/v0";
    
    /**
     * Fetches and decodes a single transaction signature using Helius Enhanced API.
     * @param signature - The transaction signature (Tx ID) to fetch.
    */
   export const getDecodedTransaction = async (signature: string): Promise<any> => {
    const HELIUS_API_KEY = process.env.HELIUS_API_KEY; 

    if (HELIUS_API_KEY === "YOUR_HELIUS_API_KEY") {
        console.warn("CRITICAL: Please set your HELIUS_API_KEY for API calls to work.");
    }
  const url = `${HELIUS_BASE}/transactions/?api-key=${HELIUS_API_KEY}`;
  try {
    const { data } = await axios.post(url, {
      transactions: [signature],
    });
    return data[0];
  } catch (error: any) {
    console.warn(`Helius API Error fetching signature ${signature}: ${error.message}`);
    return null; 
  }
};

/**
 * Fetches recent, decoded transactions for a given address using the Helius
 * getTransactionsForAddress endpoint.
 * @param address - The Public Key of the wallet/account to query.
 * @param beforeSignature - Optional cursor to start searching before a specific signature.
 */
export const getAddressHistory = async (address: string, beforeSignature: string | null = null): Promise<any[]> => {
    const HELIUS_API_KEY = process.env.HELIUS_API_KEY; 

    if (HELIUS_API_KEY === "YOUR_HELIUS_API_KEY") {
        console.warn("CRITICAL: Please set your HELIUS_API_KEY for API calls to work.");
    }
    // Use the beforeSignature parameter to ensure we search chronologically backward from a specific point.
    const beforeQuery = beforeSignature ? `&before=${beforeSignature}` : '';
    // Limit to a reasonable number to check, e.g., 20. We will filter in-memory.
    const url = `${HELIUS_BASE}/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=20${beforeQuery}`;
    
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        console.warn(`⚠️ Could not fetch transaction history for ${address}`);
        return [];
    }
};