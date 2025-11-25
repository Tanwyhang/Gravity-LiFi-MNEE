import { createPublicClient, http, getAddress, parseAbi, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

const USDC = getAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
const MNEE = getAddress('0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF');
const UNISWAP_V3_FACTORY = getAddress('0x1F98431c8aD98523631AE4a59f267346ea31F984');

// Fee tiers
const FEE_TIERS = [100, 500, 3000, 10000]; // 0.01%, 0.05%, 0.3%, 1%

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.infura.io/v3/268702a6f88b4111a031782c39503bc0')
});

const factoryAbi = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)'
]);

const poolAbi = parseAbi([
  'function liquidity() view returns (uint128)',
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function token0() view returns (address)',
  'function token1() view returns (address)'
]);

const erc20Abi = parseAbi([
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function decimals() view returns (uint8)'
]);

async function getTokenInfo(address: `0x${string}`) {
  try {
    const [symbol, name, decimals] = await Promise.all([
      publicClient.readContract({ address, abi: erc20Abi, functionName: 'symbol' }) as Promise<string>,
      publicClient.readContract({ address, abi: erc20Abi, functionName: 'name' }) as Promise<string>,
      publicClient.readContract({ address, abi: erc20Abi, functionName: 'decimals' }) as Promise<number>
    ]);
    return { symbol, name, decimals, address };
  } catch (error) {
    return { symbol: 'UNKNOWN', name: 'Unknown Token', decimals: 18, address };
  }
}

function formatLiquidity(liquidity: bigint, decimals: number = 18): string {
  const formatted = formatUnits(liquidity, decimals);
  const num = parseFloat(formatted);
  
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

async function checkTokenPools(tokenAddress: string) {
  const token = getAddress(tokenAddress);
  
  // Fetch token info
  console.log('\n🔍 Fetching token information...');
  const [tokenInfo, usdcInfo, mneeInfo] = await Promise.all([
    getTokenInfo(token),
    getTokenInfo(USDC),
    getTokenInfo(MNEE)
  ]);

  console.log('\n' + '═'.repeat(90));
  console.log(`  🪙  TOKEN: ${tokenInfo.symbol} (${tokenInfo.name})`);
  console.log(`  📍 Address: ${tokenInfo.address}`);
  console.log('═'.repeat(90));

  const results: any[] = [];

  // Check token -> USDC pools
  console.log(`\n${'─'.repeat(90)}`);
  console.log(`📊 STEP 1: ${tokenInfo.symbol} → ${usdcInfo.symbol} Pools`);
  console.log(`${'─'.repeat(90)}`);
  
  let bestTokenToUsdcPool = null;
  
  for (const fee of FEE_TIERS) {
    try {
      const poolAddress = await publicClient.readContract({
        address: UNISWAP_V3_FACTORY,
        abi: factoryAbi,
        functionName: 'getPool',
        args: [token, USDC, fee]
      }) as `0x${string}`;

      if (poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000') {
        const liquidity = await publicClient.readContract({
          address: poolAddress,
          abi: poolAbi,
          functionName: 'liquidity'
        }) as bigint;

        const hasLiquidity = liquidity > 0n;
        const formattedLiq = formatLiquidity(liquidity, tokenInfo.decimals);
        
        if (hasLiquidity) {
          console.log(`  ✅ Fee Tier: ${(fee/10000).toFixed(2)}%`);
          console.log(`     Pool: ${poolAddress}`);
          console.log(`     Liquidity: ${formattedLiq} ${tokenInfo.symbol}\n`);
          
          results.push({ token, intermediate: USDC, fee, pool: poolAddress, liquidity });
          if (!bestTokenToUsdcPool || liquidity > bestTokenToUsdcPool.liquidity) {
            bestTokenToUsdcPool = { fee, pool: poolAddress, liquidity, formattedLiq };
          }
        } else {
          console.log(`  ⚠️  Fee Tier: ${(fee/10000).toFixed(2)}% - Pool exists but has NO liquidity`);
          console.log(`     Pool: ${poolAddress}\n`);
        }
      }
    } catch (error) {
      console.log(`  ❌ Fee Tier: ${(fee/10000).toFixed(2)}% - Pool not found\n`);
    }
  }

  // Check USDC -> MNEE pool
  console.log(`${'─'.repeat(90)}`);
  console.log(`📊 STEP 2: ${usdcInfo.symbol} → ${mneeInfo.symbol} Pools`);
  console.log(`${'─'.repeat(90)}`);
  
  let bestUsdcToMneePool = null;
  
  for (const fee of FEE_TIERS) {
    try {
      const poolAddress = await publicClient.readContract({
        address: UNISWAP_V3_FACTORY,
        abi: factoryAbi,
        functionName: 'getPool',
        args: [USDC, MNEE, fee]
      }) as `0x${string}`;

      if (poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000') {
        const liquidity = await publicClient.readContract({
          address: poolAddress,
          abi: poolAbi,
          functionName: 'liquidity'
        }) as bigint;

        const hasLiquidity = liquidity > 0n;
        const formattedLiq = formatLiquidity(liquidity, usdcInfo.decimals);
        
        if (hasLiquidity) {
          console.log(`  ✅ Fee Tier: ${(fee/10000).toFixed(2)}%`);
          console.log(`     Pool: ${poolAddress}`);
          console.log(`     Liquidity: ${formattedLiq} ${usdcInfo.symbol}\n`);
          
          if (!bestUsdcToMneePool || liquidity > bestUsdcToMneePool.liquidity) {
            bestUsdcToMneePool = { fee, pool: poolAddress, liquidity, formattedLiq };
          }
        } else {
          console.log(`  ⚠️  Fee Tier: ${(fee/10000).toFixed(2)}% - Pool exists but has NO liquidity`);
          console.log(`     Pool: ${poolAddress}\n`);
        }
      }
    } catch (error) {
      console.log(`  ❌ Fee Tier: ${(fee/10000).toFixed(2)}% - Pool not found\n`);
    }
  }

  // Summary
  console.log('═'.repeat(90));
  if (results.length > 0 && bestUsdcToMneePool && bestTokenToUsdcPool) {
    console.log('✅ SWAP PATH AVAILABLE!\n');
    console.log(`   ${tokenInfo.symbol} → ${usdcInfo.symbol} → ${mneeInfo.symbol}`);
    console.log(`   ├─ ${tokenInfo.symbol} → ${usdcInfo.symbol}: ${(bestTokenToUsdcPool.fee/10000).toFixed(2)}% fee (Liq: ${bestTokenToUsdcPool.formattedLiq})`);
    console.log(`   └─ ${usdcInfo.symbol} → ${mneeInfo.symbol}: ${(bestUsdcToMneePool.fee/10000).toFixed(2)}% fee (Liq: ${bestUsdcToMneePool.formattedLiq})`);
    console.log('\n💡 Path Encoding:');
    console.log(`   encodePacked(['address', 'uint24', 'address', 'uint24', 'address'],`);
    console.log(`                [${tokenInfo.symbol}, ${bestTokenToUsdcPool.fee}, ${usdcInfo.symbol}, ${bestUsdcToMneePool.fee}, ${mneeInfo.symbol}])`);
  } else if (results.length === 0) {
    console.log(`❌ NO VIABLE SWAP PATH FOUND\n`);
    console.log(`   ${tokenInfo.symbol} does not have any liquid pools with ${usdcInfo.symbol} on Uniswap V3.`);
  } else {
    console.log(`⚠️  INCOMPLETE SWAP PATH\n`);
    console.log(`   ${tokenInfo.symbol} → ${usdcInfo.symbol} pools found, but no ${usdcInfo.symbol} → ${mneeInfo.symbol} pool available.`);
  }
  console.log('═'.repeat(90) + '\n');
  
  return results;
}

// Run if called directly
if (require.main === module) {
  const tokenAddress = process.argv[2];
  
  if (!tokenAddress) {
    console.log('\n📖 Usage: npx tsx web/scripts/check-pools.ts <TOKEN_ADDRESS>\n');
    console.log('Examples:');
    console.log('  npx tsx web/scripts/check-pools.ts 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984  # UNI');
    console.log('  npx tsx web/scripts/check-pools.ts 0x514910771AF9Ca656af840dff83E8264EcF986CA  # LINK');
    console.log('  npx tsx web/scripts/check-pools.ts 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599  # WBTC\n');
    process.exit(1);
  }

  checkTokenPools(tokenAddress).catch(console.error);
}

export { checkTokenPools };
