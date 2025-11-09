export const formatAddress = (address: string, length: number = 8): string => {
  if (!address) return '';
  if (address.length <= length * 2 + 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const formatAmount = (amount: number, mint: string): string => {
  if (mint === 'SOL') {
    return `${amount.toFixed(4)} SOL`;
  }
  return `${amount.toLocaleString()} ${mint.slice(0, 4)}...`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

