import { createPublicClient, http, formatEther, type Address, type Hash } from 'viem';
import { base } from 'viem/chains';

export interface TipTransaction {
  id: string;
  location: string;
  amount: string;
  amountInEth: string;
  time: string;
  hash: Hash;
  from: Address;
  to: Address;
  blockNumber: bigint;
  timestamp: number;
}

// Create a public client for Base network
const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

/**
 * Fetches recent transactions for a given wallet address
 * @param address - The wallet address to fetch transactions for
 * @param limit - Maximum number of transactions to fetch (default: 10)
 * @returns Array of tip transactions
 */
export async function fetchRecentTransactions(
  address: Address, 
  limit: number = 10
): Promise<TipTransaction[]> {
  try {
    // Get the latest block number
    const latestBlock = await publicClient.getBlockNumber();
    
    // Filter for transactions TO our address (incoming tips)
    const transactions: TipTransaction[] = [];
    
    // Get recent blocks and check transactions
    const recentBlocks = await Promise.all(
      Array.from({ length: 20 }, (_, i) => latestBlock - BigInt(i))
        .map(blockNumber => 
          publicClient.getBlock({ 
            blockNumber, 
            includeTransactions: true 
          }).catch(() => null)
        )
    );

    for (const block of recentBlocks) {
      if (!block) continue;
      
      for (const tx of block.transactions) {
        if (typeof tx === 'string') continue; // Skip if tx is just a hash
        
        // Check if this is a transaction TO our address with value > 0
        if (tx.to?.toLowerCase() === address.toLowerCase() && tx.value > 0n) {
          const receipt = await publicClient.getTransactionReceipt({ hash: tx.hash });
          
          if (receipt.status === 'success') {
            transactions.push({
              id: tx.hash,
              location: `Table ${Math.floor(Math.random() * 5) + 1}`, // Random location for demo
              amount: `${formatEther(tx.value)} ETH`,
              amountInEth: formatEther(tx.value),
              time: getTimeAgo(Number(block.timestamp) * 1000),
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              blockNumber: block.number,
              timestamp: Number(block.timestamp)
            });
          }
        }
      }
    }

    // Sort by timestamp (newest first) and limit results
    const sortedTransactions = transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    if (sortedTransactions.length === 0) {
      console.log('🔍 No real transactions found for address:', address);
      console.log('📝 This could mean:');
      console.log('   - No incoming transactions to this address yet');
      console.log('   - Transactions are older than the last 20 blocks');
      console.log('   - Network/RPC issues preventing data fetch');
      console.log('💡 Using mock data for demo purposes');
    } else {
      console.log(`✅ Found ${sortedTransactions.length} real transactions for address:`, address);
    }

    return sortedTransactions;

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

/**
 * Calculate USD value from ETH amount (mock function - in production use real price API)
 */
export function calculateUSDValue(ethAmount: string): string {
  const ethPrice = 2400; // Mock ETH price - in production, fetch from a price API
  const usdValue = parseFloat(ethAmount) * ethPrice;
  return `≈ $${usdValue.toFixed(2)}`;
}

/**
 * Get mock transaction data for demo purposes
 */
export function getMockTransactions(): TipTransaction[] {
  return [
    {
      id: '0x1234567890abcdef',
      location: 'Table 1',
      amount: '0.005 ETH',
      amountInEth: '0.005',
      time: '2 minutes ago',
      hash: '0x1234567890abcdef1234567890abcdef12345678' as Hash,
      from: '0xabcdef1234567890abcdef1234567890abcdef12' as Address,
      to: '0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4' as Address,
      blockNumber: 12345678n,
      timestamp: Date.now() - 2 * 60 * 1000
    },
    {
      id: '0x2345678901bcdef2',
      location: 'Counter',
      amount: '0.003 ETH',
      amountInEth: '0.003',
      time: '15 minutes ago',
      hash: '0x2345678901bcdef22345678901bcdef223456789' as Hash,
      from: '0xbcdef2345678901bcdef2345678901bcdef23456' as Address,
      to: '0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4' as Address,
      blockNumber: 12345677n,
      timestamp: Date.now() - 15 * 60 * 1000
    },
    {
      id: '0x3456789012cdef34',
      location: 'Table 2',
      amount: '0.008 ETH',
      amountInEth: '0.008',
      time: '1 hour ago',
      hash: '0x3456789012cdef343456789012cdef3434567890' as Hash,
      from: '0xcdef3456789012cdef3456789012cdef34567890' as Address,
      to: '0x742d35Cc6634C0532925a3b8D0Cd1c62C3b86Eb4' as Address,
      blockNumber: 12345676n,
      timestamp: Date.now() - 60 * 60 * 1000
    }
  ];
}
