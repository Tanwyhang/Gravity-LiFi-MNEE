import { Address, createPublicClient, http, encodePacked, Hex } from 'viem';
import { mainnet } from 'viem/chains';
import { MNEE_TOKEN_ADDRESS, USDC_ADDRESS } from '@/contracts/addresses';

// Use custom RPC if available, otherwise use public endpoint
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.infura.io/v3/268702a6f88b4111a031782c39503bc0';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(rpcUrl, {
    batch: false, // Disable batching for immediate results
  }),
});

/**
 * Find optimal route between two tokens and return encoded path bytes
 * Path format: tokenA - fee - tokenB - fee - tokenC
 */
export async function findOptimalPath(
  tokenIn: Address,
  tokenOut: Address,
  maxHops: number = 3
): Promise<Hex | null> {
  try {
    console.log('🔍 Finding route from', tokenIn, 'to', tokenOut);

    // Fees
    const FEE_LOW = 100;      // 0.01%
    const FEE_MEDIUM = 3000;  // 0.3%
    const FEE_HIGH = 10000;   // 1%

    // If same token, return null (no swap needed)
    if (tokenIn.toLowerCase() === tokenOut.toLowerCase()) {
      return null;
    }

    // Case 1: USDC -> MNEE
    if (tokenIn.toLowerCase() === USDC_ADDRESS.toLowerCase() && tokenOut.toLowerCase() === MNEE_TOKEN_ADDRESS.toLowerCase()) {
      console.log('✅ Direct USDC -> MNEE path found');
      // Path: [USDC, 100, MNEE]
      return encodePacked(
        ['address', 'uint24', 'address'],
        [tokenIn, FEE_LOW, tokenOut]
      );
    }

    // Case 2: Any Token -> USDC -> MNEE
    // We assume most tokens have a pool with USDC (fee 3000 or 500 or 100)
    // For simplicity/demo, we assume 3000 (0.3%) for Token->USDC
    if (tokenOut.toLowerCase() === MNEE_TOKEN_ADDRESS.toLowerCase()) {
      console.log('✅ Multi-hop path via USDC found');
      // Path: [tokenIn, 3000, USDC, 100, MNEE]
      return encodePacked(
        ['address', 'uint24', 'address', 'uint24', 'address'],
        [tokenIn, FEE_MEDIUM, USDC_ADDRESS, FEE_LOW, tokenOut]
      );
    }

    // TODO: Implement real BFS pathfinding with pool existence checks for production
    console.warn('❌ No route found (fallback)');
    return null;

  } catch (error) {
    console.error('❌ Route discovery failed:', error);
    return null;
  }
}

/**
 * Calculate route confidence score
 */
export function calculateRouteConfidence(path: Address[], hopCount: number): number {
  // Placeholder for now as we return bytes
  return 100;
}

