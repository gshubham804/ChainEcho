import { Request, Response } from "express";
import { getAddressHistory, getDecodedTransaction } from "../services/helius.service";
import { normalizeTransaction } from "../services/normalize.service";

// Using a cache to store already normalized transactions and avoid re-fetching
const txnCache = new Map<string, any>();

/**
 * Recursively traces the movement of a specific set of assets forward in time.
 * This function builds the 'chainEcho' logic.
 */
const traceTrailRecursive = async (
  signature: string,
  depth: number = 0,
  maxDepth: number = 5,
  visited: Set<string> = new Set()
): Promise<any> => {
  if (depth > maxDepth || visited.has(signature)) return null;

  // 1. Get current transaction data (Transaction A)
  let txn = txnCache.get(signature);
  if (!txn) {
    const rawTxn = await getDecodedTransaction(signature);
    if (!rawTxn) return null;
    txn = normalizeTransaction(rawTxn);
    if (!txn) return null;
    txnCache.set(signature, txn);
  }
  
  visited.add(signature);
  
  const node = {
    signature: txn.signature,
    timestamp: txn.timestamp,
    transfers: txn.transfers,
    children: [] as any[]
  };

  // Iterate over every asset received in this transaction
  for (const t of txn.transfers) {
    const recipient = t.to;
    const assetMint = t.mint;

    // We only trace if the asset was actually *received* by a user account or an important program
    if (recipient === "System Program" || recipient === "Unknown" || recipient === "TokenkegQfeZyiNwAJbNbGKPFXSt4EwXk7S9") continue;

    // 2. Look for the next transaction from the recipient wallet
    const recentHistory = await getAddressHistory(recipient);
    
    // We need to filter this history to find the *next* outgoing transaction that moves the asset.
    let nextSignature = null;

    for (const nextTx of recentHistory) {
        if (visited.has(nextTx.signature)) continue;
        
        // --- ASSET TRACING LOGIC: Find an outgoing transfer of the same asset ---
        const nextTransfers = [...(nextTx.nativeTransfers || []), ...(nextTx.tokenTransfers || [])];

        const outgoingTransfer = nextTransfers.find((transfer: any) => {
            // Check if the recipient wallet is the sender in the new transaction
            const isSender = (transfer.fromUserAccount === recipient) || (transfer.from === recipient);
            
            // Check if the asset mint matches the asset received in the previous step
            const isSameAsset = (assetMint === "SOL" && transfer.mint === undefined && transfer.amount > 0) || (transfer.mint === assetMint);
            
            return isSender && isSameAsset;
        });

        if (outgoingTransfer) {
            nextSignature = nextTx.signature;
            // The first match is the chronological next step
            break; 
        }
    }


    // 3. If a clear next step is found, recursively trace it
    if (nextSignature) {
      const childNode = await traceTrailRecursive(nextSignature, depth + 1, maxDepth, visited);
      if (childNode) {
        // Enhance the child node to show which asset from the parent led to it
        childNode.parentAssetMint = assetMint;
        childNode.parentRecipient = recipient;
        node.children.push(childNode);
      }
    }
  }

  return node;
};


/**
 * Express controller function to initiate the asset trace.
 */
export const traceTransaction = async (req: Request, res: Response) => {
  const { signature } = req.params as { signature: string }; 
  const depth = parseInt(req.query.depth as string) || 3;

  if (!signature) {
    return res.status(400).json({ success: false, error: "Missing transaction signature" });
  }

  console.log(`Starting chainEcho trace for ${signature} to depth ${depth}`);

  try {
    // Reset cache for a fresh trace
    txnCache.clear(); 
    
    const trail = await traceTrailRecursive(signature, 0, depth);

    res.json({
      success: true,
      depth,
      trail
    });
  } catch (err: any) {
    console.error("❌ Recursive trace error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error during trace." });
  }
};