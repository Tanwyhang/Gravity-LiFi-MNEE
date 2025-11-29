// import { createPublicClient, http, Address, getAddress } from 'viem';
// import { sepolia } from 'viem/chains';
import { Address, getAddress } from 'viem';

// Uniswap V3 Pool ABI - only the functions we need
/*
const POOL_ABI = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'observationIndex', type: 'uint16' },
      { name: 'observationCardinality', type: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16' },
      { name: 'feeProtocol', type: 'uint8' },
      { name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
*/

// Properly checksummed addresses
const WETH_ADDRESS = getAddress('0xfff9976782d46cc05630d1f6ebab18b2324d6b14');
const USDC_ADDRESS = getAddress('0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238');
// const UNI_ADDRESS = getAddress('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984');

// Uniswap V3 pools on Sepolia testnet (verified addresses)
/*
const UNISWAP_V3_POOLS: Record<string, Address> = {
  [UNI_ADDRESS.toLowerCase()]: getAddress('0x287B0e934ed0439E2a7b1d5F0FC25eA2c24b64f7'),
};
*/

// Fallback prices for tokens without pools
const FALLBACK_PRICES: Record<string, number> = {
  [USDC_ADDRESS.toLowerCase()]: 1.00, // USDC is pegged to $1
  [WETH_ADDRESS.toLowerCase()]: 2500.00, // Approximate ETH price
};

// Get RPC URL from environment or use default Sepolia endpoint
/*
const getRpcUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const defaultUrl = 'https://rpc.sepolia.org';
  
  if (!envUrl || envUrl.includes('YOUR_INFURA_PROJECT_ID')) {
    console.warn('[Oracle] Using default Sepolia RPC. Set NEXT_PUBLIC_RPC_URL for better reliability.');
    return defaultUrl;
  }
  
  console.log('[Oracle] Using configured RPC URL');
  return envUrl;
};

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(getRpcUrl()),
});
*/

/**
 * Calculate price from Uniswap V3 sqrtPriceX96
 */
/*
function sqrtPriceX96ToPrice(sqrtPriceX96: bigint, token0Decimals: number, token1Decimals: number): number {
  const Q96 = 2n ** 96n;
  const price = (Number(sqrtPriceX96) / Number(Q96)) ** 2;
  const decimalAdjustment = 10 ** (token0Decimals - token1Decimals);
  return price * decimalAdjustment;
}
*/

/**
 * Get token price in USD using Uniswap V3 on Sepolia
 */
export async function getTokenPriceUSD(tokenAddress: Address): Promise<number> {
  const normalizedAddress = tokenAddress.toLowerCase();

  console.log(`[Oracle] MOCK: Getting price for token ${tokenAddress}`);

  // MOCK: Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check fallback prices first
  if (FALLBACK_PRICES[normalizedAddress]) {
    console.log(`[Oracle] MOCK: Using fallback price for ${tokenAddress}: $${FALLBACK_PRICES[normalizedAddress]}`);
    return FALLBACK_PRICES[normalizedAddress];
  }

  // MOCK: Return mock prices for common tokens
  const MOCK_PRICES: Record<string, number> = {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 1.00, // USDC Mainnet
    '0x9cafedbae4916b79da7f3f612efb2eb93a2bfd6cf': 2.50, // MNEE token
    '0x6b175474e89094c44da98b954eedeac495271d0f': 1.00, // DAI
    '0xdac17f958d2ee523a2206206994597c13d831ec7': 1.00, // USDT
  };

  if (MOCK_PRICES[normalizedAddress]) {
    console.log(`[Oracle] MOCK: Using mock price for ${tokenAddress}: $${MOCK_PRICES[normalizedAddress]}`);
    return MOCK_PRICES[normalizedAddress];
  }

  // MOCK: Default price for unknown tokens
  console.log(`[Oracle] MOCK: Using default price $1.00 for unknown token ${tokenAddress}`);
  return 1.00;

  /*
  // ORIGINAL BLOCKCHAIN INTERACTIONS (COMMENTED OUT):

  const poolAddress = UNISWAP_V3_POOLS[normalizedAddress];
  if (!poolAddress) {
    console.warn(`[Oracle] No Uniswap V3 pool found for ${tokenAddress}, using fallback $1.00`);
    return 1.00;
  }

  try {
    console.log(`[Oracle] Fetching price for ${tokenAddress} from Sepolia V3 pool ${poolAddress}...`);

    // Get pool data
    const [slot0Data, token0, token1] = await Promise.all([
      publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: 'slot0',
      }),
      publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: 'token0',
      }),
      publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: 'token1',
      }),
    ]);

    const sqrtPriceX96 = slot0Data[0];
    console.log(`[Oracle] Slot0 sqrtPriceX96:`, sqrtPriceX96.toString());

    // Determine token order
    const isToken0 = token0.toLowerCase() === normalizedAddress;
    const isWETHToken0 = token0.toLowerCase() === WETH_ADDRESS.toLowerCase();

    // Calculate price (assuming 18 decimals for both)
    let priceInWETH = sqrtPriceX96ToPrice(sqrtPriceX96, 18, 18);

    // Adjust based on token position
    if (!isToken0) {
      priceInWETH = 1 / priceInWETH;
    }

    if (isWETHToken0 && isToken0) {
      priceInWETH = 1 / priceInWETH;
    }

    // Convert to USD
    const ethPriceUSD = FALLBACK_PRICES[WETH_ADDRESS.toLowerCase()];
    const finalPrice = priceInWETH * ethPriceUSD;

    console.log(`[Oracle] ✅ ${tokenAddress} price: $${finalPrice.toFixed(2)} (${priceInWETH.toFixed(6)} WETH)`);
    return finalPrice;

  } catch (error: any) {
    console.error(`[Oracle] ❌ Error fetching price for ${tokenAddress}:`);
    console.error(`[Oracle] Error:`, error?.message || error);
    console.warn(`[Oracle] Falling back to $1.00`);
    return 1.00;
  }
  */
}

/**
 * Convert USD amount to token amount using Uniswap V3 prices
 */
export async function convertUSDToTokenAmount(
  usdAmount: string,
  tokenAddress: Address,
  tokenDecimals: number
): Promise<string> {
  const usd = parseFloat(usdAmount);
  if (isNaN(usd) || usd <= 0) return '0';
  
  const priceUSD = await getTokenPriceUSD(tokenAddress);
  const tokenAmount = usd / priceUSD;
  
  console.log(`[Oracle] Converting $${usd} → ${tokenAmount.toFixed(6)} tokens @ $${priceUSD.toFixed(2)}/token`);
  
  return tokenAmount.toFixed(Math.min(6, tokenDecimals));
}
