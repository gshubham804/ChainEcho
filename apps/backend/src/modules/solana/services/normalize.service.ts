import dayjs from "dayjs";

/**
 * Normalizes a decoded transaction object from Helius into a clean, asset-focused structure.
 * @param txn - Decoded transaction object from Helius /v0/transactions.
 */
export const normalizeTransaction = (txn: any) => {
  if (!txn) return null;

  const { signature, slot, timestamp, fee, type, tokenTransfers, nativeTransfers } = txn;
  
  const transfers: any[] = [];

  // 1. Token transfers (including NFTs)
  if (Array.isArray(tokenTransfers)) {
    for (const t of tokenTransfers) {
      if (t.transferType === "TRANSFER" || t.transferType === "NFT_TRANSFER") {
        transfers.push({
          from: t.fromUserAccount,
          to: t.toUserAccount,
          amount: t.tokenAmount,
          mint: t.mint, // The unique asset identifier (token or NFT mint address)
          type: "Token Transfer",
          slot: txn.slot,
          timestamp: txn.timestamp
        });
      }
    }
  }

  // 2. Native SOL transfers
  if (Array.isArray(nativeTransfers)) {
    for (const n of nativeTransfers) {
      if (n.amount > 0 && n.fromUserAccount !== n.toUserAccount) {
        transfers.push({
          from: n.fromUserAccount,
          to: n.toUserAccount,
          amount: n.amount / 1e9, // convert lamports to SOL
          mint: "SOL",
          type: "Native Transfer",
          slot: txn.slot,
          timestamp: txn.timestamp
        });
      }
    }
  }

  return {
    signature,
    slot,
    timestamp: timestamp ? dayjs.unix(timestamp).toISOString() : null,
    fee,
    type,
    transfers
  };
};